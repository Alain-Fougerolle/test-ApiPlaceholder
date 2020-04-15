import React, { Component } from 'react';

// Import Material UI //
import Switch from '@material-ui/core/Switch';

// Redux //
import { connect } from 'react-redux';

// Actions //
import { changeStatus } from '../actions';

class ChangeStatus extends Component {

    render() {
        return (
            <Switch
                id="checkStatus"
                name="checkStatus"
                onChange={() => {this.props.dispatch(changeStatus(this.props.id))}}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                checked={this.props.status.includes(this.props.id) ? true : false}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.changeStatus.status
    };
};

export default connect(mapStateToProps)(ChangeStatus);
