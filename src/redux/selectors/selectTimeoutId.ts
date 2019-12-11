import { AppState } from 'redux/reducers/rootReducer';

const selectTimeoutId = (state: AppState) => {
  return state.forceTaskCompletion.timeoutId;
};

export default selectTimeoutId;
