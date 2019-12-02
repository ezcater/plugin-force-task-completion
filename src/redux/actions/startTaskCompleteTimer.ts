import {AppState} from 'redux/reducers/rootReducer';
import {TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID} from 'constants/NotificationId';
import {ACTION_START_TASK_COMPLETION_TIMER} from 'constants/ActionTypes';
import {COMPLETION_LIMIT_IN_MILLISECONDS} from 'constants/Durations';
import {TASK_PENDING_COMPLETION_NOTIFICATION_ID} from 'constants/NotificationId';
import tracker from 'utilities/tracker';
import selectValidTaskInWrapUp from 'redux/selectors/selectValidTaskInWrapUp';

export interface StartTaskCompleteTimerAction {
  type: typeof ACTION_START_TASK_COMPLETION_TIMER;
  payload: {
    completeTaskTimeoutId: number;
  };
}

const startTaskCompleteTimer = (): StartTaskCompleteTimerAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();
  const validTaskInWrapUp = selectValidTaskInWrapUp(state);

  window.clearTimeout(state.forceTaskCompletion.completeTaskTimeoutId);

  const newCompleteTaskTimeoutId = window.setTimeout(() => {
    if (!validTaskInWrapUp) {
      return;
    }

    validTaskInWrapUp.complete().then(() => {
      tracker.track('force task completion activity', {
        action: 'task completed',
      });

      window.Twilio.Flex.Notifications.dismissNotificationById(
        TASK_PENDING_COMPLETION_NOTIFICATION_ID
      );
      window.Twilio.Flex.Notifications.showNotification(
        TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID
      );
    });
  }, COMPLETION_LIMIT_IN_MILLISECONDS);

  return {
    type: ACTION_START_TASK_COMPLETION_TIMER,
    payload: {
      completeTaskTimeoutId: newCompleteTaskTimeoutId,
    },
  };
};

export default startTaskCompleteTimer;
