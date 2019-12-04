import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import registerReducers from 'registerReducers';
import registerListeners from 'registerListeners';
import registerNotifications from 'registerNotifications';
import showNotificationIfTaskExists from 'utilities/showNotificationIfTaskExists';

declare global {
  interface Window {
    tracker: any;
  }
}

const PLUGIN_NAME = 'ForceTaskCompletionPlugin';

class ForceTaskCompletionPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  // This code is run when your plugin is being started
  // Use this to modify any UI components or attach to the actions framework
  init(flex: typeof Flex, manager: Flex.Manager) {
    registerReducers(manager);
    registerListeners(manager);
    registerNotifications();

    showNotificationIfTaskExists();
  }
}

export default ForceTaskCompletionPlugin;
