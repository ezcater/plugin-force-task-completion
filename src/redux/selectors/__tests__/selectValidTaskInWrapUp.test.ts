import selectValidTaskInWrapUp from '../selectValidTaskInWrapUp';
import {STAGING_GENERAL_SUPPORT} from '../../../constants/ValidTaskQueues';

describe('selectValidTaskInWrapUp', () => {
  describe('when there is a matching task', () => {
    const task = {
      taskChannelUniqueName: 'voice',
      queueSid: STAGING_GENERAL_SUPPORT,
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
    const state = {
      flex: {
        worker: {
          tasks: new Map([['WT123', task]]),
        },
      },
    };

    it('returns the task', () => {
      const validTaskInTaskUp = selectValidTaskInWrapUp(state);

      expect(validTaskInTaskUp).toEqual(task);
    });
  });

  describe('when there is not a matching task', () => {
    const task = {
      taskChannelUniqueName: 'chat',
      queueSid: 'WS123',
      dateUpdated: Date.now(),
      taskStatus: 'assigned',
    };
    const state = {
      flex: {
        worker: {
          tasks: new Map([['WT123', task]]),
        },
      },
    };

    it('returns undefined', () => {
      const validTaskInTaskUp = selectValidTaskInWrapUp(state);

      expect(validTaskInTaskUp).toEqual(undefined);
    });
  });
});
