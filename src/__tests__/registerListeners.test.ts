import configureStore from 'redux-mock-store';
import { ACTION_CLEAR_TIMERS } from './../constants/ActionTypes';
import {
  reservationWrapUpCallback,
  reservationCompletionCallback,
} from './../registerListeners';

const configuredStore = configureStore();
const store = configuredStore({
  forceTaskCompletion: {
    notificationTimeoutId: 200,
  },
});

global.Twilio = {
  Flex: {
    Manager: {
      getInstance: () => ({ store }),
    },
    Notifications: {
      showNotification: jest.fn(),
      dismissNotificationById: jest.fn(),
    },
  },
} as any;

const dispatch = jest.fn();

const mockedManager = {
  store: {
    getState: () => ({
      forceTaskCompletion: {
        notificationTimeoutId: 100,
        completeTaskTimeoutId: 200,
      },
    }),
    dispatch,
  },
} as any;

describe('registerListeners', () => {
  it('it dispatches the correct event on task wrap up', () => {
    global.setTimeout = () => 100 as any;

    reservationWrapUpCallback(mockedManager);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'plugin-force-completion/START_NOTIFICATION_TIMER',
      payload: {
        notificationTimeoutId: 100,
      },
    });
  });

  it('it dispatches the correct event on task completion', () => {
    reservationCompletionCallback(mockedManager);

    expect(dispatch).toHaveBeenCalledWith({ type: ACTION_CLEAR_TIMERS });
  });
});
