import React from 'react';
import {
  NOTIFICATION_LIMIT_IN_MINUTES,
  COMPLETION_LIMIT_IN_MINUTES,
  COMPLETION_LIMIT_IN_MILLISECONDS,
} from 'constants/Durations';
import {AppState} from 'redux/reducers/rootReducer';
import selectIsSnoozed from 'redux/selectors/selectIsSnoozed';
import {connect} from 'react-redux';

interface Props {
  isSnoozed: boolean;
}

interface State {
  secondsUntilWrapUp: number;
}

class WrapUpNotificationContent extends React.Component<Props, State> {
  interval: number | undefined;

  constructor(props: Props) {
    super(props);

    this.interval = undefined;

    this.state = {
      secondsUntilWrapUp: COMPLETION_LIMIT_IN_MILLISECONDS / 1000,
    };
  }

  componentDidMount() {
    this.interval = window.setInterval(() => {
      const {secondsUntilWrapUp} = this.state;

      this.setState({secondsUntilWrapUp: secondsUntilWrapUp - 1});
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    const {isSnoozed} = this.props;
    const {secondsUntilWrapUp} = this.state;
    const totalWrapUpTimeLimit = NOTIFICATION_LIMIT_IN_MINUTES + COMPLETION_LIMIT_IN_MINUTES;

    const completionMessage = `You've been in wrap up for almost ${totalWrapUpTimeLimit} minutes. This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;
    const snoozeMessage = `This task will auto-complete in ${secondsUntilWrapUp} seconds. If you need additional time before the task completes, click "Snooze" to keep the task open for 5 more minutes.`;
    const message = isSnoozed ? snoozeMessage : completionMessage;

    return <>{message}</>;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    isSnoozed: selectIsSnoozed(state),
  };
};

export default connect(mapStateToProps)(WrapUpNotificationContent);
