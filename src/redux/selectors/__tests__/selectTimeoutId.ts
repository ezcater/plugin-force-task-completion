import selectTimeoutId from '../selectTimeoutId';

const state = {
  forceTaskCompletion: {
    timeoutId: 200,
  },
} as any;

describe('selectTimeoutId', () => {
  it('returns the correct state', () => {
    const timeoutId = selectTimeoutId(state);

    expect(timeoutId).toEqual(200);
  });
});
