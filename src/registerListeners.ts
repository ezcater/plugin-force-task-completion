import {Manager} from '@twilio/flex-ui';
import {NOTIFICATION_LIMIT_IN_MILLISECONDS} from 'constants/Durations';
import startNotificationTimer from 'redux/actions/startNotificationTimer';
import clearTimers from 'redux/actions/clearTimers';

export const reservationWrapUpCallback = (manager: Manager) => {
  manager.store.dispatch(startNotificationTimer(NOTIFICATION_LIMIT_IN_MILLISECONDS));
};

export const reservationCompletionCallback = (manager: Manager) => {
  manager.store.dispatch(clearTimers());
};

const registerListeners = (manager: Manager) => {
  manager.workerClient.on('reservationCreated', (reservation: any) => {
    reservation.on('wrapup', () => reservationWrapUpCallback(manager));

    reservation.on('completed', () => reservationCompletionCallback(manager));
  });
};

export default registerListeners;
