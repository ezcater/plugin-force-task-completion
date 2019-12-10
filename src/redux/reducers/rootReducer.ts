import { StartTaskCompleteTimerAction } from 'redux/actions/startTaskCompleteTimer';
import { StartNotificationTimerAction } from 'redux/actions/startNotificationTimer';
import { ClearTimersAction } from 'redux/actions/clearTimers';
import { FlexState } from '@twilio/flex-ui';
import * as ActionTypes from 'constants/ActionTypes';
import { SnoozeNotificationAction } from 'redux/actions/snoozeNotification';

// Register all component states under the namespace
export interface AppState extends FlexState {
  forceTaskCompletion: ForceCompletionNotificationState;
}

export interface ForceCompletionNotificationState {
  isSnoozed: boolean;
  timeoutId?: number;
}

type Actions =
  | ClearTimersAction
  | StartNotificationTimerAction
  | StartTaskCompleteTimerAction
  | SnoozeNotificationAction;

const initialState: ForceCompletionNotificationState = {
  isSnoozed: false,
  timeoutId: undefined,
};

const rootReducer = (
  state: ForceCompletionNotificationState = initialState,
  action: Actions
) => {
  switch (action.type) {
    case ActionTypes.ACTION_CLEAR_TIMERS: {
      return initialState;
    }
    case ActionTypes.ACTION_START_TIMER: {
      return {
        ...state,
        timeoutId: action.payload.timeoutId,
      };
    }
    case ActionTypes.ACTION_SNOOZE_TIMER: {
      return {
        ...state,
        isSnoozed: true,
        timeoutId: action.payload.timeoutId,
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
