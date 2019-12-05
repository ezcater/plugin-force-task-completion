import selectCompleteTaskTimeoutId from '../selectCompleteTaskTimeoutId';

const state = {
  forceTaskCompletion: {
    completeTaskTimeoutId: 100,
  },
} as any;

describe('selectCompleteTaskTimeoutId', () => {
  it('returns the correct state', () => {
    const completeTaskTimeoutId = selectCompleteTaskTimeoutId(state);

    expect(completeTaskTimeoutId).toEqual(100);
  });
});
