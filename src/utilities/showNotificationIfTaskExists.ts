import startNotificationTimer from '../redux/actions/startNotificationTimer';
import {TASK_PENDING_COMPLETION_NOTIFICATION_ID} from './../constants/NotificationId';
import {NOTIFICATION_LIMIT_IN_MILLISECONDS} from './../constants/Durations';
import selectValidTaskInWrapUp from '../redux/selectors/selectValidTaskInWrapUp';

const showNotificationIfTaskExists = () => {
  const manager = window.Twilio.Flex.Manager.getInstance();
  const state = manager.store.getState();
  const validTaskInWrapUp = selectValidTaskInWrapUp(state);

  if (!validTaskInWrapUp) {
    return;
  }

  const timeSinceTaskCreation = Date.now().valueOf() - validTaskInWrapUp.dateUpdated.valueOf();
  const isOverTimeLimit = timeSinceTaskCreation >= NOTIFICATION_LIMIT_IN_MILLISECONDS;

  if (isOverTimeLimit) {
    window.Twilio.Flex.Notifications.showNotification(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
  } else {
    const timeoutDuration = NOTIFICATION_LIMIT_IN_MILLISECONDS - timeSinceTaskCreation;

    manager.store.dispatch(startNotificationTimer(timeoutDuration));
  }
};

export default showNotificationIfTaskExists;
