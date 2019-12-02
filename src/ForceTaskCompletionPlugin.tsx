import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import registerReducers from 'registerReducers';
import registerListeners from 'registerListeners';
import registerNotifications from 'registerNotifications';
import showNotificationIfTaskExists from 'utilities/showNotificationIfTaskExists';
import { createFeatureFlagsClient } from '@ezcater/feature-flags-js';

const featureFlagsClient = createFeatureFlagsClient();

declare global {
  interface Window {
    tracker: any;
  }
}

const PLUGIN_NAME = 'ForceTaskCompletionPlugin';
const FEATURE_FLAG_KEY = 'Liberty:PluginForceTaskCompletion';

class ForceTaskCompletionPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  // This code is run when your plugin is being started
  // Use this to modify any UI components or attach to the actions framework
  init(flex: typeof Flex, manager: Flex.Manager) {
    featureFlagsClient
      .get({
        featureFlags: [FEATURE_FLAG_KEY],
        trackingId: manager.workerClient.attributes.trackingId,
        whitelistValues: [manager.workerClient.attributes.email],
      })
      .then(featureFlags => {
        if (featureFlags[FEATURE_FLAG_KEY]) {
          registerReducers(manager);
          registerListeners(manager);
          registerNotifications();

          showNotificationIfTaskExists();
        }
      });
  }
}

export default ForceTaskCompletionPlugin;
