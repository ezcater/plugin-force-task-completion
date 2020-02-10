import { AppState } from 'redux/reducers/rootReducer';
import { TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID } from 'constants/NotificationId';
import { ACTION_START_TIMER } from 'constants/ActionTypes';
import { COMPLETION_LIMIT_IN_MILLISECONDS } from 'constants/Durations';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from 'constants/NotificationId';
import tracker from 'utilities/tracker';
import selectValidTask from 'redux/selectors/selectValidTask';
import getIsTaskCompletable from 'utilities/getIsTaskCompletable';

export interface StartTaskCompleteTimerAction {
  type: typeof ACTION_START_TIMER;
  payload: {
    timeoutId: number;
  };
}

const startTaskCompleteTimer = (): StartTaskCompleteTimerAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.timeoutId);

  const timeoutId = window.setTimeout(() => {
    const state: AppState = manager.store.getState();
    const validTask = selectValidTask(state);
    const isTaskCompletable = getIsTaskCompletable(validTask);

    if (!isTaskCompletable || !validTask) {
      return;
    }

    validTask.complete().then(() => {
      tracker.track('force task completion activity', {
        action: 'task completed',
        id: validTask?.taskSid || null,
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
    type: ACTION_START_TIMER,
    payload: { timeoutId },
  };
};

export default startTaskCompleteTimer;
