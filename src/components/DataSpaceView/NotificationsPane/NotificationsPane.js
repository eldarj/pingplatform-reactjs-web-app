import React, { Component } from 'react'
import { connect } from 'react-redux'

import './NotificationsPane.scss'

class NotificationsPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountVM: null,
            isOpen: props.isOpen
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }
    }

    onToggleNavCollapse = () => {
        this.setState({
            isOpen: false
        });
    }

    render() {
        let visible = this.props.isOpen ?  'visible' : 'hidden'
        if(!this.state.isOpen) visible = 'hidden';

        return(
            <div className={"notifications-panel py-2 px-4 bg-white border box-shadow " + visible}>
                <div className="d-flex justify-content-end mt-1">
                    <span className="ms-icon-regular" onClick={this.onToggleNavCollapse}> close </span>
                </div>
                <h6>Notifications</h6>
            </div>
        );
    }
}
    

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(NotificationsPane)