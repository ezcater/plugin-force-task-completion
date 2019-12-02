import selectValidTaskInWrapUp from 'redux/selectors/selectValidTaskInWrapUp';
import { ACTION_SNOOZE_NOTIFICATION_TIMER } from 'constants/ActionTypes';
import { SNOOZE_DURATION_IN_MILLISECONDS } from 'constants/Durations';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from 'constants/NotificationId';
import tracker from 'utilities/tracker';

export interface SnoozeNotificationAction {
  type: typeof ACTION_SNOOZE_NOTIFICATION_TIMER;
  payload: {
    notificationTimeoutId: number;
  };
}

const timeoutCallback = () => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();
  const validTaskInWrapUp = selectValidTaskInWrapUp(state);

  if (!validTaskInWrapUp) {
    manager.store.dispatch(snoozeNotification());

    tracker.track('force task completion activity', {
      action: 'notification snoozed due to active call',
    });
  } else {
    window.Twilio.Flex.Notifications.showNotification(
      TASK_PENDING_COMPLETION_NOTIFICATION_ID
    );

    tracker.track('force task completion activity', {
      action: 'notification shown',
    });
  }
};

const snoozeNotification = (): SnoozeNotificationAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.completeTaskTimeoutId);
  window.clearTimeout(state.forceTaskCompletion.notificationTimeoutId);

  window.Twilio.Flex.Notifications.dismissNotificationById(
    TASK_PENDING_COMPLETION_NOTIFICATION_ID
  );

  const newNotificationTimeoutId = window.setTimeout(
    timeoutCallback,
    SNOOZE_DURATION_IN_MILLISECONDS
  );

  return {
    type: ACTION_SNOOZE_NOTIFICATION_TIMER,
    payload: {
      notificationTimeoutId: newNotificationTimeoutId,
    },
  };
};

export default snoozeNotification;
