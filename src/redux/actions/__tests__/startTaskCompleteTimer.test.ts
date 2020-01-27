import configureStore from 'redux-mock-store';
import { ACTION_START_TIMER } from './../../../constants/ActionTypes';
import startTaskCompleteTimer from '../startTaskCompleteTimer';
import {
  TASK_PENDING_COMPLETION_NOTIFICATION_ID,
  TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID,
} from './../../../constants/NotificationId';
import * as selectValidTask from '../../selectors/selectValidTask';
import * as getIsTaskCompletable from '../../../utilities/getIsTaskCompletable';
import tracker from './../../../utilities/tracker';

const task = {
  taskChannelUniqueName: 'voice',
  queueSid: 'WQ123',
  dateUpdated: Date.now().valueOf() - 100000000,
  taskStatus: 'wrapping',
  conference: {
    participants: [
      {
        isMyself: false,
        status: 'recently_left',
      },
    ],
  },
  complete: jest.fn().mockReturnValue(Promise.resolve()),
} as any;

const configuredStore = configureStore();
const store = configuredStore({
  flex: {
    worker: {
      tasks: new Map([['WT123', task]]),
    },
    config: {
      pluginForceTaskCompletion: {
        taskQueues: ['WQ123'],
        taskChannels: ['voice'],
      },
    },
  },
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

const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
};

describe('startTaskCompleteTimer', () => {
  beforeEach(() => {
    jest.spyOn(tracker, 'track');
  });

  describe('when the action is called', () => {
    it('returns the correct action', () => {
      global.setTimeout = () => 200 as any;

      const action = startTaskCompleteTimer();

      expect(action).toEqual({
        type: ACTION_START_TIMER,
        payload: {
          timeoutId: 200,
        },
      });
    });

    it('clears the timeoutId', () => {
      startTaskCompleteTimer();

      expect(global.clearTimeout).toHaveBeenCalledWith(100);
    });
  });

  describe('when the timeout created by the action is called', () => {
    describe('when there is not a valid task', () => {
      beforeEach(() => {
        jest.spyOn(selectValidTask, 'default').mockReturnValue(undefined);
      });

      it('does not throw an error', () => {
        startTaskCompleteTimer();

        expect(() => jest.runOnlyPendingTimers()).not.toThrow();
      });
    });

    describe('when the task is not completable', () => {
      beforeEach(() => {
        jest.spyOn(selectValidTask, 'default').mockReturnValue({} as any);
        jest.spyOn(getIsTaskCompletable, 'default').mockReturnValue(false);
      });

      it('does not throw an error', () => {
        startTaskCompleteTimer();

        expect(() => jest.runOnlyPendingTimers()).not.toThrow();
      });
    });

    describe('when the task is completable', () => {
      beforeEach(() => {
        jest.spyOn(selectValidTask, 'default').mockReturnValue(task);
        jest.spyOn(getIsTaskCompletable, 'default').mockReturnValue(true);
      });

      it('completes the task', () => {
        startTaskCompleteTimer();

        jest.runAllTimers();

        expect(task.complete).toHaveBeenCalled();
      });

      it('calls the event tracking utility', async () => {
        startTaskCompleteTimer();

        jest.runAllTimers();

        await flushPromises();

        expect(tracker.track).toHaveBeenCalledWith(
          'force task completion activity',
          {
            action: 'task completed',
            id: 'WT123',
          }
        );
      });

      it('dismisses the correct notification', async () => {
        startTaskCompleteTimer();

        jest.runAllTimers();

        await flushPromises();

        expect(
          window.Twilio.Flex.Notifications.dismissNotificationById
        ).toHaveBeenCalledWith(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
      });

      it('shows the correct notification', async () => {
        startTaskCompleteTimer();

        jest.runAllTimers();

        await flushPromises();

        expect(
          window.Twilio.Flex.Notifications.showNotification
        ).toHaveBeenCalledWith(TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID);
      });
    });
  });
});
