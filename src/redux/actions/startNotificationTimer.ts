import {AppState} from 'redux/reducers/rootReducer';
import {TASK_PENDING_COMPLETION_NOTIFICATION_ID} from './../../constants/NotificationId';
import selectValidTaskInWrapUp from 'redux/selectors/selectValidTaskInWrapUp';
import {ACTION_START_NOTIFICATION_TIMER} from 'constants/ActionTypes';
import tracker from 'utilities/tracker';
import snoozeNotification from './snoozeNotification';

export interface StartNotificationTimerAction {
  type: typeof ACTION_START_NOTIFICATION_TIMER;
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
    window.Twilio.Flex.Notifications.showNotification(TASK_PENDING_COMPLETION_NOTIFICATION_ID);

    tracker.track('force task completion activity', {
      action: 'notification shown',
    });
  }
};

const startNotificationTimer = (timeoutDuration: number): StartNotificationTimerAction => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state: AppState = manager.store.getState();

  window.clearTimeout(state.forceTaskCompletion.notificationTimeoutId);

  const newNotificationTimeoutId = window.setTimeout(timeoutCallback, timeoutDuration);

  return {
    type: ACTION_START_NOTIFICATION_TIMER,
    payload: {
      notificationTimeoutId: newNotificationTimeoutId,
    },
  };
};

export default startNotificationTimer;
