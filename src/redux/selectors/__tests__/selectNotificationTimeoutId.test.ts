import selectNotificationTimeoutId from '../selectNotificationTimeoutId';

const state = {
  forceTaskCompletion: {
    notificationTimeoutId: 200,
  },
} as any;

describe('selectNotificationTimeoutId', () => {
  it('returns the correct state', () => {
    const notificationTimeoutId = selectNotificationTimeoutId(state);

    expect(notificationTimeoutId).toEqual(200);
  });
});
