import selectValidTaskInWrapUp from '../selectValidTaskInWrapUp';

describe('selectValidTaskInWrapUp', () => {
  describe('when there is a matching task', () => {
    describe('and there are no active participants on the conference', () => {
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
      const state = {
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
      } as any;

      it('returns the task', () => {
        const validTaskInTaskUp = selectValidTaskInWrapUp(state);

        expect(validTaskInTaskUp).toEqual(task);
      });
    });

    describe('and there are active participants on the conference', () => {
      const task = {
        taskChannelUniqueName: 'voice',
        queueSid: 'WQ123',
        dateUpdated: Date.now().valueOf() - 100000000,
        taskStatus: 'wrapping',
        conference: {
          participants: [
            {
              isMyself: false,
              status: 'joined',
            },
          ],
        },
      };
      const state = {
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
      } as any;

      it('returns undefined', () => {
        const validTaskInTaskUp = selectValidTaskInWrapUp(state);

        expect(validTaskInTaskUp).toEqual(undefined);
      });
    });
  });

  describe('when there is not a matching task', () => {
    const task = {
      taskChannelUniqueName: 'chat',
      queueSid: 'WQ123',
      dateUpdated: Date.now(),
      taskStatus: 'assigned',
    };
    const state = {
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
    } as any;

    it('returns undefined', () => {
      const validTaskInTaskUp = selectValidTaskInWrapUp(state);

      expect(validTaskInTaskUp).toEqual(undefined);
    });
  });
});
