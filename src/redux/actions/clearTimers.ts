import { AppState } from 'redux/reducers/rootReducer';
import { ACTION_CLEAR_TIMERS } from 'constants/ActionTypes';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from 'constants/NotificationId';
import tracker from 'utilities/tracker';

export interface ClearTimersAction {
  type: typeof ACTION_CLEAR_TIMERS;
}

const clearTimers = (): ClearTimersAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.completeTaskTimeoutId);
  window.clearTimeout(state.forceTaskCompletion.notificationTimeoutId);

  window.Twilio.Flex.Notifications.dismissNotificationById(
    TASK_PENDING_COMPLETION_NOTIFICATION_ID
  );

  tracker.track('force task completion activity', {
    action: 'forced completion canceled',
  });

  return {
    type: ACTION_CLEAR_TIMERS,
  };
};

export default clearTimers;
