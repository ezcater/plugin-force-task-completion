import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import WrapUpNotificationContent from '../WrapUpNotificationContent';
import {
  NOTIFICATION_LIMIT_IN_MINUTES,
  COMPLETION_LIMIT_IN_MINUTES,
  COMPLETION_LIMIT_IN_MILLISECONDS,
} from '../../constants/Durations';

const configuredStore = configureStore([]);

describe('<WrapUpNotificationContent />', () => {
  describe('when the notification has not been snoozed', () => {
    const store = configuredStore({
      forceTaskCompletion: {
        isSnoozed: false,
      },
    });

    it('displays the correct initial message', () => {
      const { getByText } = render(
        <Provider store={store}>
          <WrapUpNotificationContent />
        </Provider>
      );

      const secondsUntilWrapUp = COMPLETION_LIMIT_IN_MILLISECONDS / 1000;
      const totalWrapUpTimeLimit =
        NOTIFICATION_LIMIT_IN_MINUTES + COMPLETION_LIMIT_IN_MINUTES;
      const message = `You've been in wrap up for almost ${totalWrapUpTimeLimit} minutes. This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;

      const messageElement = getByText(message);

      expect(messageElement).not.toBeNull();
    });

    it('displays the correct message after time has elapsed', () => {
      const { getByText } = render(
        <Provider store={store}>
          <WrapUpNotificationContent />
        </Provider>
      );

      jest.advanceTimersByTime(1000);

      const secondsUntilWrapUp = COMPLETION_LIMIT_IN_MILLISECONDS / 1000 - 1;
      const totalWrapUpTimeLimit =
        NOTIFICATION_LIMIT_IN_MINUTES + COMPLETION_LIMIT_IN_MINUTES;
      const message = `You've been in wrap up for almost ${totalWrapUpTimeLimit} minutes. This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;

      const messageElement = getByText(message);

      expect(messageElement).not.toBeNull();
    });
  });

  describe('when the notification has been snoozed', () => {
    const store = configuredStore({
      forceTaskCompletion: {
        isSnoozed: true,
      },
    });

    it('displays the correct initial message', () => {
      const { getByText } = render(
        <Provider store={store}>
          <WrapUpNotificationContent />
        </Provider>
      );

      const secondsUntilWrapUp = COMPLETION_LIMIT_IN_MILLISECONDS / 1000;
      const message = `This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;

      const messageElement = getByText(message);

      expect(messageElement).not.toBeNull();
    });

    it('displays the correct message after time has elapsed', () => {
      const { getByText } = render(
        <Provider store={store}>
          <WrapUpNotificationContent />
        </Provider>
      );

      jest.advanceTimersByTime(1000);

      const secondsUntilWrapUp = COMPLETION_LIMIT_IN_MILLISECONDS / 1000 - 1;
      const message = `This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;

      const messageElement = getByText(message);

      expect(messageElement).not.toBeNull();
    });
  });
});
