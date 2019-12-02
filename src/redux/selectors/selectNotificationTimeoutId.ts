import { AppState } from 'redux/reducers/rootReducer';

const selectNotificationTimeoutId = (state: AppState) => {
  return state.forceTaskCompletion.notificationTimeoutId;
};

export default selectNotificationTimeoutId;
