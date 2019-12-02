const MILLISECONDS_MULTIPLIER = 60000;

const notificationLimitOverride = window.localStorage.getItem(
  'PluginForceTaskCompletion:NOTIFICATION_LIMIT_IN_MINUTES'
);

const completionLimitOverride = window.localStorage.getItem(
  'PluginForceTaskCompletion:COMPLETION_LIMIT_IN_MINUTES'
);

const snoozeDurationOverride = window.localStorage.getItem(
  'PluginForceTaskCompletion:SNOOZE_DURATION_IN_MINUTES'
);

export const NOTIFICATION_LIMIT_IN_MINUTES = notificationLimitOverride
  ? Number(notificationLimitOverride)
  : 29;
export const NOTIFICATION_LIMIT_IN_MILLISECONDS =
  NOTIFICATION_LIMIT_IN_MINUTES * MILLISECONDS_MULTIPLIER;

export const COMPLETION_LIMIT_IN_MINUTES = completionLimitOverride
  ? Number(completionLimitOverride)
  : 1;
export const COMPLETION_LIMIT_IN_MILLISECONDS =
  COMPLETION_LIMIT_IN_MINUTES * MILLISECONDS_MULTIPLIER;

export const SNOOZE_DURATION_IN_MINUTES = snoozeDurationOverride
  ? Number(snoozeDurationOverride)
  : 4;

export const SNOOZE_DURATION_IN_MILLISECONDS = SNOOZE_DURATION_IN_MINUTES * MILLISECONDS_MULTIPLIER;
