import {ITask} from '@twilio/flex-ui';
import {AppState} from 'redux/reducers/rootReducer';
import {NOTIFICATION_LIMIT_IN_MILLISECONDS} from 'constants/Durations';
import ValidTaskChannels from 'constants/ValidTaskChannels';
import ValidTaskQueues from 'constants/ValidTaskQueues';

const selectValidTaskInWrapUp = (state: AppState): ITask | undefined => {
  const tasks = Array.from(state.flex.worker.tasks.values());

  return tasks.find(task => {
    const isValidTaskChannel = ValidTaskChannels.includes(task.taskChannelUniqueName);
    const isValidTaskQueue = ValidTaskQueues.includes(task.queueSid);
    const timeSinceCreation = Date.now().valueOf() - task.dateUpdated.valueOf();
    const isWrapUpTimeOverLimit =
      task.taskStatus === 'wrapping' && timeSinceCreation >= NOTIFICATION_LIMIT_IN_MILLISECONDS;
    const hasConferenceWithActiveParticipants =
      task.conference &&
      task.conference.participants &&
      task.conference.participants.some(participant => {
        return participant.isMyself === false && participant.status === 'joined';
      });

    return (
      isValidTaskChannel &&
      isValidTaskQueue &&
      isWrapUpTimeOverLimit &&
      !hasConferenceWithActiveParticipants
    );
  });
};

export default selectValidTaskInWrapUp;
