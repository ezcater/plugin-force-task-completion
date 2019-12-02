import { AppState } from 'redux/reducers/rootReducer';

const selectIsSnoozed = (state: AppState) => {
  return state.forceTaskCompletion.isSnoozed;
};

export default selectIsSnoozed;
