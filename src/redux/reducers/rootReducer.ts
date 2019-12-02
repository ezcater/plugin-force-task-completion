import {StartTaskCompleteTimerAction} from 'redux/actions/startTaskCompleteTimer';
import {StartNotificationTimerAction} from 'redux/actions/startNotificationTimer';
import {ClearTimersAction} from 'redux/actions/clearTimers';
import {FlexState} from '@twilio/flex-ui';
import * as ActionTypes from 'constants/ActionTypes';
import {SnoozeNotificationAction} from 'redux/actions/snoozeNotification';

// Register all component states under the namespace
export interface AppState extends FlexState {
  forceTaskCompletion: ForceCompletionNotificationState;
}

export interface ForceCompletionNotificationState {
  isSnoozed: boolean;
  notificationTimeoutId?: number;
  completeTaskTimeoutId?: number;
}

type Actions =
  | ClearTimersAction
  | StartNotificationTimerAction
  | StartTaskCompleteTimerAction
  | SnoozeNotificationAction;

const initialState: ForceCompletionNotificationState = {
  isSnoozed: false,
  notificationTimeoutId: undefined,
  completeTaskTimeoutId: undefined,
};

const rootReducer = (state: ForceCompletionNotificationState = initialState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.ACTION_CLEAR_TIMERS: {
      return initialState;
    }

    case ActionTypes.ACTION_START_NOTIFICATION_TIMER: {
      return {
        ...state,
        notificationTimeoutId: action.payload.notificationTimeoutId,
      };
    }

    case ActionTypes.ACTION_START_TASK_COMPLETION_TIMER: {
      return {
        ...state,
        completeTaskTimeoutId: action.payload.completeTaskTimeoutId,
      };
    }

    case ActionTypes.ACTION_SNOOZE_NOTIFICATION_TIMER: {
      return {
        ...state,
        isSnoozed: true,
        notificationTimeoutId: action.payload.notificationTimeoutId,
      };
    }

    default:
      return state;
  }
};

export default rootReducer;
