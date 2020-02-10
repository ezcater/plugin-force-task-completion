import configureStore from 'redux-mock-store';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from './../../../constants/NotificationId';
import { ACTION_CLEAR_TIMERS } from '../../../constants/ActionTypes';
import clearTimers from '../clearTimers';
import tracker from './../../../utilities/tracker';

const task = {
  taskSid: 'WT123',
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
};

const configuredStore = configureStore();
const store = configuredStore({
  forceTaskCompletion: {
    timeoutId: 100,
  },
  flex: {
    worker: {
      tasks: new Map([['WT123', task]]),
    },
    config: {
      pluginForceTaskCompletion: {
        taskChannels: ['voice'],
        taskQueues: ['WQ123'],
      },
    },
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
    },
  },
} as any;

describe('clearTimers', () => {
  beforeEach(() => {
    jest.spyOn(tracker, 'track');
  });

  it('returns the correct action', () => {
    const action = clearTimers();

    expect(action).toEqual({
      type: ACTION_CLEAR_TIMERS,
    });
  });

  it('clears the timeoutId', () => {
    clearTimers();

    expect(global.clearTimeout).toHaveBeenCalledWith(100);
  });

  it('dismisses the correct notification', () => {
    clearTimers();

    expect(
      window.Twilio.Flex.Notifications.dismissNotificationById
    ).toHaveBeenCalledWith(TASK_PENDING_COMPLETION_NOTIFICATION_ID);
  });

  it('calls the event tracking utility', () => {
    clearTimers();

    expect(tracker.track).toHaveBeenCalledWith(
      'force task completion activity',
      {
        action: 'forced completion canceled',
        id: 'WT123',
      }
    );
  });
});
