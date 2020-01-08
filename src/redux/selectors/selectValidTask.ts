import { ITask } from '@twilio/flex-ui';
import { AppState } from '../reducers/rootReducer';
import { NOTIFICATION_LIMIT_IN_MILLISECONDS } from '../../constants/Durations';

const selectValidTask = (state: AppState): ITask | undefined => {
  const tasks = Array.from(state.flex.worker.tasks.values());
  const config = state.flex.config as any;
  const { taskChannels, taskQueues } = config.pluginForceTaskCompletion;

  return tasks.find(task => {
    const isValidTaskChannel = taskChannels.includes(
      task.taskChannelUniqueName
    );
    const isValidTaskQueue = taskQueues.includes(task.queueSid);
    const timeSinceCreation = Date.now().valueOf() - task.dateUpdated.valueOf();
    const isWrapUpTimeOverLimit =
      task.taskStatus === 'wrapping' &&
      timeSinceCreation >= NOTIFICATION_LIMIT_IN_MILLISECONDS;

    return isValidTaskChannel && isValidTaskQueue && isWrapUpTimeOverLimit;
  });
};

export default selectValidTask;
