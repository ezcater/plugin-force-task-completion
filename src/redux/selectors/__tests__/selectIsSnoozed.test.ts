import selectIsSnoozed from '../selectIsSnoozed';

const state = {
  forceTaskCompletion: {
    isSnoozed: true,
  },
};

describe('selectIsSnoozed', () => {
  it('returns the correct state', () => {
    const isSnoozed = selectIsSnoozed(state);

    expect(isSnoozed).toEqual(true);
  });
});
