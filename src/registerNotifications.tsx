import React from 'react';
import * as Flex from '@twilio/flex-ui';
import SnoozeButton from 'components/SnoozeButton';
import WrapUpNotificationContent from 'components/WrapUpNotificationContent';
import {
  TASK_PENDING_COMPLETION_NOTIFICATION_ID,
  TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID,
} from 'constants/NotificationId';

const registerNotifications = () => {
  window.Twilio.Flex.Notifications.registerNotification({
    id: TASK_PENDING_COMPLETION_NOTIFICATION_ID,
    closeButton: false,
    content: <WrapUpNotificationContent />,
    timeout: 0,
    type: Flex.NotificationType.warning,
    actions: [<SnoozeButton key="snooze-button" />],
    options: {
      browser: {
        title: 'Your task will auto-complete soon.',
        body:
          'Complete your current task or click "Snooze" to give yourself 5 more minutes.',
      },
    },
  });

  window.Twilio.Flex.Notifications.registerNotification({
    id: TASK_SUCCESSFULLY_COMPLETED_NOTIFICATION_ID,
    closeButton: true,
    content:
      'Your task has automatically been completed due to high wrap up time.',
    timeout: 0,
    type: Flex.NotificationType.success,
  });
};

export default registerNotifications;
