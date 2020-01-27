import configureStore from 'redux-mock-store';
import { ACTION_SNOOZE_TIMER } from './../../../constants/ActionTypes';
import snoozeNotification from '../snoozeNotification';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from './../../../constants/NotificationId';
import tracker from './../../../utilities/tracker';
import * as selectValidTask from '../../selectors/selectValidTask';
import * as getIsTaskCompletable from '../../../utilities/getIsTaskCompletable';

const configuredStore = configureStore();
const store = configuredStore({
  forceTaskCompletion: {
    timeoutId: 100,
  },
});

global.clearTimeout = jest.fn();

global.Twilio = {
  Flex: {
    Manager: {
      getInstance: () => ({ store }),
    },
    Notifications: {
      dismissNotificationById: jest.fn(),
      showNotification: jest.fn(),
    },
  },
} as any;

describe('snoozeNotification', () => {
  beforeEach(() => {
    jest.spyOn(tracker, 'track');
  });

  describe('when the action is called', () => {
    it('returns the correct action', () => {
      global.setTimeout = () => 200 as any;

      const action = snoozeNotification();

      expect(action).toEqual({
        type: ACTION_SNOOZE_TIMER,
        payload: {
          timeoutId: 200,
        },
      });
    });

    it('clears the completeTaskTimeoutId', () => {
      snoozeNotification();

      expect(window.clearTimeout).toHaveBeenCalledWith(100);
    });

    it('dismisses the correct notification', () => {
      snoozeNotification();

      expect(
        window.Twilio.Flex.Notifications.dismissNotificationById
      ).toHaveBeenCalledWith(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
    });
  });

  describe('when the timeout created by the action is called', () => {
    describe('and the task is in a valid state', () => {
      beforeEach(() => {
        jest.spyOn(selectValidTask, 'default').mockReturnValue({} as any);
      });

      it('shows the correct notification', () => {
        snoozeNotification();

        jest.runOnlyPendingTimers();

        expect(
          window.Twilio.Flex.Notifications.showNotification
        ).toHaveBeenCalledWith(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
      });
    });

    describe('and the task is not in a valid state', () => {
      beforeEach(() => {
        jest.spyOn(selectValidTask, 'default').mockReturnValue({});
        jest.spyOn(getIsTaskCompletable, 'default').mockReturnValue(false);
      });

      it('sets a new timeout', () => {
        snoozeNotification();

        jest.runOnlyPendingTimers();

        expect(setTimeout).toHaveBeenCalledTimes(2);
      });

      it('does not show the notification', () => {
        snoozeNotification();

        jest.runOnlyPendingTimers();

        expect(
          window.Twilio.Flex.Notifications.showNotification
        ).not.toHaveBeenCalled();
      });

      it('calls the tracking utility', () => {
        snoozeNotification();

        jest.runOnlyPendingTimers();

        expect(tracker.track).toHaveBeenCalledWith(
          'force task completion activity',
          {
            action: 'notification snoozed due to active call',
            id: 'WT123',
          }
        );
      });
    });
  });
});
