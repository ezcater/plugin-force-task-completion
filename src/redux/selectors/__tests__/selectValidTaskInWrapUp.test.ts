import selectValidTask from '../selectValidTask';

describe('selectValidTask', () => {
  describe('when there is a matching task', () => {
    const task = {
      taskChannelUniqueName: 'voice',
      queueSid: 'WQ123',
      dateUpdated: Date.now().valueOf() - 100000000,
      taskStatus: 'wrapping',
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
      const validTaskInTaskUp = selectValidTask(state);

      expect(validTaskInTaskUp).toEqual(task);
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
      const validTaskInTaskUp = selectValidTask(state);

      expect(validTaskInTaskUp).toEqual(undefined);
    });
  });
});
