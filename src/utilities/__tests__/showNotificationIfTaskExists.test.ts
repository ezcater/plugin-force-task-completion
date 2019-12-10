import configureStore from 'redux-mock-store';
import * as startNotificationTimer from '../../redux/actions/startNotificationTimer';
import * as selectValidTaskInWrapUp from '../../redux/selectors/selectValidTaskInWrapUp';
import { ACTION_START_TIMER } from './../../constants/ActionTypes';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from './../../constants/NotificationId';
import showNotificationIfTaskExists from '../showNotificationIfTaskExists';

const configuredStore = configureStore();
const store = configuredStore();

global.Twilio = {
  Flex: {
    Manager: {
      getInstance: () => ({ store }),
    },
    Notifications: {
      showNotification: jest.fn(),
    },
  },
} as any;

describe('showNotificationIfTaskExists', () => {
  beforeEach(() => {
    store.clearActions();
  });

  describe('if there is a valid task in wrap up', () => {
    describe('and if the task is already over the time limit', () => {
      beforeEach(() => {
        jest
          .spyOn(selectValidTaskInWrapUp, 'default')
          .mockReturnValue({ dateUpdated: { valueOf: () => 1 } } as any);
      });

      it('shows the correct notification', () => {
        showNotificationIfTaskExists();

        expect(
          window.Twilio.Flex.Notifications.showNotification
        ).toHaveBeenCalledWith(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
      });
    });

    describe('and if the task is not already over the time limit', () => {
      beforeEach(() => {
        jest
          .spyOn(startNotificationTimer, 'default')
          .mockImplementation(() => ({
            type: ACTION_START_TIMER,
            payload: { timeoutId: 201 },
          }));
        jest
          .spyOn(selectValidTaskInWrapUp, 'default')
          .mockReturnValue({ dateUpdated: { valueOf: () => 10000 } } as any);
        global.Date = { now: () => ({ valueOf: () => 20000 }) } as any;
      });

      it('dispatches the correct action', () => {
        showNotificationIfTaskExists();

        expect(store.getActions()).toEqual([
          {
            type: ACTION_START_TIMER,
            payload: { timeoutId: 201 },
          },
        ]);
      });
    });
  });

  describe('if there is no valid task in wrap up', () => {
    beforeEach(() => {
      jest.spyOn(selectValidTaskInWrapUp, 'default').mockReturnValue(undefined);
    });

    it('does not show a notification', () => {
      showNotificationIfTaskExists();

      expect(
        window.Twilio.Flex.Notifications.showNotification
      ).not.toHaveBeenCalled();
    });

    it('does not dispatch an action', () => {
      showNotificationIfTaskExists();

      expect(store.getActions()).toEqual([]);
    });
  });
});
