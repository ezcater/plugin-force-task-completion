import React from 'react';
import { NotificationBar, ITask } from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TASK_PENDING_COMPLETION_NOTIFICATION_ID } from 'constants/NotificationId';
import startTaskCompleteTimer, {
  StartTaskCompleteTimerAction,
} from 'redux/actions/startTaskCompleteTimer';
import snoozeNotification, {
  SnoozeNotificationAction,
} from 'redux/actions/snoozeNotification';
import tracker from 'utilities/tracker';
import selectValidTask from 'redux/selectors/selectValidTask';
import { AppState } from 'redux/reducers/rootReducer';

interface Props {
  dispatchSnoozeNotification: () => void;
  dispatchStartTaskCompleteTimer: () => void;
  validTask?: ITask;
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

const mapDispatchToProps = (
  dispatch: Dispatch<SnoozeNotificationAction | StartTaskCompleteTimerAction>
) => {
  return {
    dispatchSnoozeNotification: () => dispatch(snoozeNotification()),
    dispatchStartTaskCompleteTimer: () => dispatch(startTaskCompleteTimer()),
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    validTask: selectValidTask(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SnoozeButton);
