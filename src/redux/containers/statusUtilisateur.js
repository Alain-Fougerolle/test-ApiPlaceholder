import React, { Component } from "react";

// Import Material UI Icons //
import AccountBoxIcon from '@material-ui/icons/AccountBox';

// Redux //
import { connect } from 'react-redux';

class StatusUtilisateur extends Component {
    render() {
        return (
            <AccountBoxIcon 
                color={this.props.status.includes(this.props.id) ? "secondary" : "primary"} 
                fontSize="large" 
                className="AccountBoxIcon"
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.changeStatus.status
    };
};

export default connect(mapStateToProps)(StatusUtilisateur);