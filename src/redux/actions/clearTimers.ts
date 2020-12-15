import { AppState } from '../../redux/reducers/rootReducer';
import { ACTION_CLEAR_TIMERS } from '../../constants/ActionTypes';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from '../../constants/NotificationId';
import tracker from '../../utilities/tracker';
import selectValidTask from '../../redux/selectors/selectValidTask';

export interface ClearTimersAction {
  type: typeof ACTION_CLEAR_TIMERS;
}

const clearTimers = (): ClearTimersAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();
  const validTask = selectValidTask(state);

  window.clearTimeout(state.forceTaskCompletion.timeoutId);

  window.Twilio.Flex.Notifications.dismissNotificationById(
    TASK_PENDING_COMPLETION_NOTIFICATION_ID
  );

  tracker.track('force task completion activity', {
    action: 'forced completion canceled',
    id: validTask?.taskSid || null,
  });

  return {
    type: ACTION_CLEAR_TIMERS,
  };
};

export default clearTimers;
