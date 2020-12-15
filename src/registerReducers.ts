import { Manager } from '@twilio/flex-ui';
import rootReducer from './redux/reducers/rootReducer';

// Register your redux store under a unique namespace
export const namespace = 'forceTaskCompletion';

const registerReducers = (manager: Manager) => {
  if (!manager.store.addReducer) {
    // tslint: disable-next-line
    console.error(
      `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${window.Twilio.Flex.VERSION}`
    );

    return;
  }

  manager.store.addReducer(namespace, rootReducer);
};

export default registerReducers;
