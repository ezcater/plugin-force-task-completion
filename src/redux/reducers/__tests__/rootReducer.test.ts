import rootReducer from '../rootReducer';
import {
  ACTION_CLEAR_TIMERS,
  ACTION_START_NOTIFICATION_TIMER,
  ACTION_START_TASK_COMPLETION_TIMER,
  ACTION_SNOOZE_NOTIFICATION_TIMER,
} from './../../../constants/ActionTypes';

const initialState = {
  isSnoozed: false,
  notificationTimeoutId: undefined,
  completeTaskTimeoutId: undefined,
};

describe('rootReducer', () => {
  it('should return the initial state', () => {
    const state = rootReducer(initialState, {});

    expect(state).toEqual(initialState);
  });

  it(`should handle ${ACTION_CLEAR_TIMERS}`, () => {
    const state = rootReducer(
      {
        isSnoozed: false,
        completeTaskTimeoutId: 100,
        notificationTimeoutId: 200,
      },
      {type: ACTION_CLEAR_TIMERS}
    );

    expect(state).toEqual({
      isSnoozed: false,
      completeTaskTimeoutId: undefined,
      notificationTimeoutId: undefined,
    });
  });

  it(`should handle ${ACTION_START_NOTIFICATION_TIMER}`, () => {
    const state = rootReducer(initialState, {
      type: ACTION_START_NOTIFICATION_TIMER,
      payload: {notificationTimeoutId: 201},
    });

    expect(state).toEqual({
      isSnoozed: false,
      completeTaskTimeoutId: undefined,
      notificationTimeoutId: 201,
    });
  });

  it(`should handle ${ACTION_START_TASK_COMPLETION_TIMER}`, () => {
    const state = rootReducer(initialState, {
      type: ACTION_START_TASK_COMPLETION_TIMER,
      payload: {completeTaskTimeoutId: 101},
    });

    expect(state).toEqual({
      isSnoozed: false,
      completeTaskTimeoutId: 101,
      notificationTimeoutId: undefined,
    });
  });

  it(`should handle ${ACTION_SNOOZE_NOTIFICATION_TIMER}`, () => {
    const state = rootReducer(initialState, {
      type: ACTION_SNOOZE_NOTIFICATION_TIMER,
      payload: {notificationTimeoutId: 201},
    });

    expect(state).toEqual({
      isSnoozed: true,
      completeTaskTimeoutId: undefined,
      notificationTimeoutId: 201,
    });
  });
});
