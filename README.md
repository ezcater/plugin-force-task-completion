# plugin-force-task-completion

<a href="https://codeclimate.com/github/codeclimate/codeclimate/maintainability"><img src="https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability" /></a>

![](https://media.giphy.com/media/8JW82ndaYfmNoYAekM/giphy.gif)

A Twilio Flex plugin to force completion of a task after a set period of time. By default, the notification will appear 29 minutes into the wrap up phase of a task, then the task will automatically complete if the agent does not choose to "snooze" the notificiation.

When an agent "snoozes" the task completion notification it will reappear 4 minutes later and provide another 60 second window to snooze the task before the task is automatically completed.

If an agent is on an active call when the notification is timed to appear, the notification will automatically be snoozed for another 4 minutes repeatedly until the agent is not on a call.

## Get started

### Install:

```
npm install
```

### Run the plugin:

```
npm start
PORT=3001 npm start
```

### Deploy to Twilio Assets

This process will automatically build then upload your plugin to the account your Twilio-CLI is connected to. These plugins will automatically show up in your account's instance of flex after it has been deployed.

```
npm run build
npm run deploy
```

## Redux

### Store

```
forceTaskCompletion: {
  isSnoozed: boolean,
  notificationTimeoutId?: number,
  completeTaskTimeoutId?: number;
}
```

### Actions

#### `plugin-force-completion/START_NOTIFICATION_TIMER`

Dispatched when the task goes into wrap up. The timeout to display the notification is created when this action dispatched.

#### `plugin-force-completion/SNOOZE_NOTIFICATION_TIMER`

Dispatched when the agent clicks "Snooze" on the displayed notification. The timeout to re-show the notification is created when this action is dispatched.

#### `plugin-force-completion/START_TASK_COMPLETION_TIMER`

Dispatched when the limit to show the notification has been reached. The timeout to complete the task is created when this action is dispatched.

#### `plugin-force-completion/CLEAR_TIMERS`

Dispatched when the reservation is completed

## Configuration

### Durations

These can be edited to increase or decrease the amount of time between events.

#### `NOTIFICATION_LIMIT_IN_MINUTES`

The duration of time before the task completion notification appears once the agent has sent the task into wrap up.
This can be overriden in localStorage using the key `PluginForceTaskCompletion:NOTIFICATION_LIMIT_IN_MINUTES`.

#### `COMPLETION_LIMIT_IN_MINUTES`

The duration of time before the task is automatically completed after the task completion notification has been shown.
This can be overriden in localStorage using the key `PluginForceTaskCompletion:COMPLETION_LIMIT_IN_MINUTES`.

#### `SNOOZE_DURATION_IN_MINUTES`

The duration of time before the task is re-shown after the agent clicks "Snooze" on the task completion notification.
This can be overriden in localStorage using the key `PluginForceTaskCompletion:SNOOZE_DURATION_IN_MINUTES`.

### Channels and queues

Define what channels and queues you'd like to show the notification in within your `appConfig`.

```js
{
  ...
  pluginForceTaskCompletion: {
    // The task channels for which the task completion notification will appear
    // for. If the corresponding task channel is not listed in this array then
    // the task will never be forced into completion.
    taskChannels: ['voice', 'outbound-voice'],
    // The task queues sids for which the task completion notification will appear
    // for. If the corresponding task queue sid is not listed in this array then
    // the task will never be forced into completion.
    taskQueues: ['WQ123'],
  },
}
```
