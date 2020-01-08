import { ITask } from '@twilio/flex-ui';

const getIsTaskCompletable = (task?: ITask) => {
  if (!task) {
    return false;
  }

  const hasConferenceWithActiveParticipants =
    task.conference &&
    task.conference.participants &&
    task.conference.participants.some(participant => {
      return participant.isMyself === false && participant.status === 'joined';
    });

  return !hasConferenceWithActiveParticipants;
};

export default getIsTaskCompletable;
