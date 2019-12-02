import {AppState} from 'redux/reducers/rootReducer';

const selectCompleteTaskTimeoutId = (state: AppState) => {
  return state.forceTaskCompletion.completeTaskTimeoutId;
};

export default selectCompleteTaskTimeoutId;
