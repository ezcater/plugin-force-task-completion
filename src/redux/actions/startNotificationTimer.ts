import { AppState } from 'redux/reducers/rootReducer';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from './../../constants/NotificationId';
import selectValidTask from 'redux/selectors/selectValidTask';
import { ACTION_START_TIMER } from 'constants/ActionTypes';
import tracker from 'utilities/tracker';
import snoozeNotification from './snoozeNotification';
import getIsTaskCompletable from 'utilities/getIsTaskCompletable';

export interface StartNotificationTimerAction {
  type: typeof ACTION_START_TIMER;
  payload: {
    timeoutId: number;
  };
}

const timeoutCallback = () => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();

  const validTask = selectValidTask(state);
  const isTaskCompletable = getIsTaskCompletable(validTask);

  if (!validTask) {
    return;
  }

  if (!isTaskCompletable) {
    manager.store.dispatch(snoozeNotification());

    tracker.track('force task completion activity', {
      action: 'notification snoozed due to active call',
      id: validTask.taskSid,
    });
  } else {
    window.Twilio.Flex.Notifications.showNotification(
      TASK_PENDING_COMPLETION_NOTIFICATION_ID
    );

    tracker.track('force task completion activity', {
      action: 'notification shown',
      id: validTask.taskSid,
    });
  }
};

const startNotificationTimer = (
  timeoutDuration: number
): StartNotificationTimerAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.timeoutId);

  const timeoutId = window.setTimeout(timeoutCallback, timeoutDuration);

  return {
    type: ACTION_START_TIMER,
    payload: { timeoutId },
  };
};

export default startNotificationTimer;
