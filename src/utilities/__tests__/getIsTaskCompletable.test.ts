import getIsTaskCompletable from '../getIsTaskCompletable';

describe('getIsTaskCompletable', () => {
  describe('when there are active participants on the conference', () => {
    const task = {
      conference: {
        participants: [
          {
            isMyself: true,
            status: 'joined',
          },
          {
            isMyself: false,
            status: 'joined',
          },
        ],
      },
    } as any;

    it('returns false', () => {
      const isTaskCompletable = getIsTaskCompletable(task);

      expect(isTaskCompletable).toBe(false);
    });
  });
  describe('when there are not active participants on the conference', () => {
    const task = {
      conference: {
        participants: [
          {
            isMyself: true,
            status: 'joined',
          },
          {
            isMyself: false,
            status: 'recently_left',
          },
        ],
      },
    } as any;

    it('returns true', () => {
      const isTaskCompletable = getIsTaskCompletable(task);

      expect(isTaskCompletable).toBe(true);
    });
  });
});
