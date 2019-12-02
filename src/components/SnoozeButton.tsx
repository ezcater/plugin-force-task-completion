import React from 'react';
import {NotificationBar} from '@twilio/flex-ui';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {TASK_PENDING_COMPLETION_NOTIFICATION_ID} from 'constants/NotificationId';
import startTaskCompleteTimer, {
  StartTaskCompleteTimerAction,
} from 'redux/actions/startTaskCompleteTimer';
import snoozeNotification, {SnoozeNotificationAction} from 'redux/actions/snoozeNotification';
import tracker from 'utilities/tracker';

interface Props {
  dispatchSnoozeNotification: () => void;
  dispatchStartTaskCompleteTimer: () => void;
}

class SnoozeButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatchStartTaskCompleteTimer();
  }

  handleClick() {
    this.props.dispatchSnoozeNotification();

    tracker.track('force task completion activity', {
      action: 'notification snoozed',
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

const mapDispatchToProps = (
  dispatch: Dispatch<SnoozeNotificationAction | StartTaskCompleteTimerAction>
) => {
  return {
    dispatchSnoozeNotification: () => dispatch(snoozeNotification()),
    dispatchStartTaskCompleteTimer: () => dispatch(startTaskCompleteTimer()),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SnoozeButton);
