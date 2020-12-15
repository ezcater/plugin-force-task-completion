import selectValidTask from '../../redux/selectors/selectValidTask';
import { ACTION_SNOOZE_TIMER } from '../../constants/ActionTypes';
import { SNOOZE_DURATION_IN_MILLISECONDS } from '../../constants/Durations';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from '../../constants/NotificationId';
import tracker from '../../utilities/tracker';
import getIsTaskCompletable from '../../utilities/getIsTaskCompletable';

export interface SnoozeNotificationAction {
  type: typeof ACTION_SNOOZE_TIMER;
  payload: {
    timeoutId: number;
  };
}

const timeoutCallback = () => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();
  const validTask = selectValidTask(state);
  const isTaskCompletable = getIsTaskCompletable(validTask);

  if (!isTaskCompletable) {
    manager.store.dispatch(snoozeNotification());

    tracker.track('force task completion activity', {
      action: 'notification snoozed due to active call',
      id: validTask?.taskSid || null,
    });
  } else {
    window.Twilio.Flex.Notifications.showNotification(
      TASK_PENDING_COMPLETION_NOTIFICATION_ID
    );

    tracker.track('force task completion activity', {
      action: 'notification shown',
      id: validTask?.taskSid || null,
    });
  }
};

const snoozeNotification = (): SnoozeNotificationAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.timeoutId);

  window.Twilio.Flex.Notifications.dismissNotificationById(
    TASK_PENDING_COMPLETION_NOTIFICATION_ID
  );

  const timeoutId = window.setTimeout(
    timeoutCallback,
    SNOOZE_DURATION_IN_MILLISECONDS
  );

  return {
    type: ACTION_SNOOZE_TIMER,
    payload: { timeoutId },
  };
};

export default snoozeNotification;
