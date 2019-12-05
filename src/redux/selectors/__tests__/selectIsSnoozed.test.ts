import selectIsSnoozed from '../selectIsSnoozed';

const state = {
  forceTaskCompletion: {
    isSnoozed: true,
  },
} as any;

describe('selectIsSnoozed', () => {
  it('returns the correct state', () => {
    const isSnoozed = selectIsSnoozed(state);

    expect(isSnoozed).toEqual(true);
  });
});
