import React from 'react';
import { NotificationBar } from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from '../constants/NotificationId';
import startTaskCompleteTimer from '../redux/actions/startTaskCompleteTimer';
import snoozeNotification from '../redux/actions/snoozeNotification';
import tracker from '../utilities/tracker';
import selectValidTask from '../redux/selectors/selectValidTask';
import { AppState } from '../redux/reducers/rootReducer';

class SnoozeButton extends React.Component<ConnectedProps<typeof connector>> {
  constructor(props: ConnectedProps<typeof connector>) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatchStartTaskCompleteTimer();
  }

  handleClick() {
    const { dispatchSnoozeNotification, validTask } = this.props;

    dispatchSnoozeNotification();

    tracker.track('force task completion activity', {
      action: 'notification snoozed',
      id: validTask?.taskSid || null,
    });
  }

  render() {
    return (
      <NotificationBar.Action
        key={`${TASK_PENDING_COMPLETION_NOTIFICATION_ID}-snooze`}
        label="Snooze"
        onClick={this.handleClick}
        icon="Bell"
      />
    );
  }
}

const mapDispatchToProps = {
  dispatchSnoozeNotification: snoozeNotification,
  dispatchStartTaskCompleteTimer: startTaskCompleteTimer,
};

const mapStateToProps = (state: AppState) => {
  return {
    validTask: selectValidTask(state),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SnoozeButton);
