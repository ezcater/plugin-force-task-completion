var appConfig = {
  pluginService: {
    enabled: true,
    url: '/plugins',
  },
  ytica: false,
  logLevel: 'debug',
  showSupervisorDesktopView: true,
  pluginForceTaskCompletion: {
    taskChannels: ['voice', 'outbound-voice'],
    taskQueues: ['WQ123'],
  },
};
