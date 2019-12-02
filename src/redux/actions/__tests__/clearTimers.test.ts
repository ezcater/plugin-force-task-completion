import configureStore from 'redux-mock-store';
import {TASK_PENDING_COMPLETION_NOTIFICATION_ID} from './../../../constants/NotificationId';
import {ACTION_CLEAR_TIMERS} from '../../../constants/ActionTypes';
import clearTimers from '../clearTimers';
import tracker from './../../../utilities/tracker';

const configuredStore = configureStore();
const store = configuredStore({
  forceTaskCompletion: {
    completeTaskTimeoutId: 100,
    notificationTimeoutId: 200,
  },
});

global.clearTimeout = jest.fn();

global.Twilio = {
  Flex: {
    Manager: {
      getInstance: () => ({store}),
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

  it('clears the completeTaskTimeoutId', () => {
    clearTimers();

    expect(global.clearTimeout).toHaveBeenCalledWith(100);
  });

  it('clears the notificationTimeoutId', () => {
    clearTimers();

    expect(global.clearTimeout).toHaveBeenCalledWith(200);
  });

  it('dismisses the correct notification', () => {
    clearTimers();

    expect(window.Twilio.Flex.Notifications.dismissNotificationById).toHaveBeenCalledWith(
      TASK_PENDING_COMPLETION_NOTIFICATION_ID
    );
  });

  it('calls the event tracking utility', () => {
    clearTimers();

    expect(tracker.track).toHaveBeenCalledWith('force task completion activity', {
      action: 'forced completion canceled',
    });
  });
});
