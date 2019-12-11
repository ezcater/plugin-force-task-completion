import rootReducer from '../rootReducer';
import {
  ACTION_CLEAR_TIMERS,
  ACTION_START_TIMER,
  ACTION_SNOOZE_TIMER,
} from './../../../constants/ActionTypes';

const initialState = {
  isSnoozed: false,
  timeoutId: undefined,
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
        timeoutId: 100,
      },
      { type: ACTION_CLEAR_TIMERS }
    );

    expect(state).toEqual({
      isSnoozed: false,
      timeoutId: undefined,
    });
  });

  it(`should handle ${ACTION_START_TIMER}`, () => {
    const state = rootReducer(initialState, {
      type: ACTION_START_TIMER,
      payload: { timeoutId: 201 },
    });

    expect(state).toEqual({
      isSnoozed: false,
      timeoutId: 201,
    });
  });

  it(`should handle ${ACTION_SNOOZE_TIMER}`, () => {
    const state = rootReducer(initialState, {
      type: ACTION_SNOOZE_TIMER,
      payload: { timeoutId: 202 },
    });

    expect(state).toEqual({
      isSnoozed: true,
      timeoutId: 202,
    });
  });
});
