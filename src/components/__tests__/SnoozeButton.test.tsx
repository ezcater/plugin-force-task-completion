import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import SnoozeButton from '../SnoozeButton';

import {
  ACTION_START_TIMER,
  ACTION_SNOOZE_TIMER,
} from '../../constants/ActionTypes';
import tracker from '../../utilities/tracker';

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
};

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
    isSnoozed: false,
    timeoutId: 100,
    task: {},
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

describe('<SnoozeButton />', () => {
  beforeEach(() => {
    store.clearActions();
    jest.spyOn(tracker, 'track');
  });

  it('dispatches the correct action on mount', () => {
    global.setTimeout = () => 200 as any;

    render(
      <Provider store={store}>
        <SnoozeButton />
      </Provider>
    );

    expect(store.getActions()).toContainEqual({
      type: ACTION_START_TIMER,
      payload: { timeoutId: 200 },
    });
  });

  it('dispatches the correct action on click', () => {
    global.setTimeout = () => 300 as any;

    const { getByText } = render(
      <Provider store={store}>
        <SnoozeButton />
      </Provider>
    );

    const actionButton = getByText('Snooze');

    fireEvent.click(actionButton);

    expect(store.getActions()).toContainEqual({
      type: ACTION_SNOOZE_TIMER,
      payload: {
        timeoutId: 300,
      },
    });
  });

  it('calls the tracking utility on click', () => {
    global.setTimeout = () => 300 as any;

    const { getByText } = render(
      <Provider store={store}>
        <SnoozeButton />
      </Provider>
    );

    const actionButton = getByText('Snooze');

    fireEvent.click(actionButton);

    expect(tracker.track).toHaveBeenCalledWith(
      'force task completion activity',
      {
        action: 'notification snoozed',
      }
    );
  });
});
