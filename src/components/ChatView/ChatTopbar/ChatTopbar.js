import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    Modal, CommandBar, IconButton, Icon,
    Spinner, ProgressIndicator,
    PrimaryButton, DefaultButton, ActionButton
} from 'office-ui-fabric-react'

class ChatTopbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    // Data for CommandBar
    _getItems = () => [
        { key: 'view', name: 'View', iconProps: { iconName: 'ActivityFeed' },  subMenuProps: {
            isBeakVisible: false,
            items: [
                { key: 'contacts', name: 'Show Contacts' },
                { key: 'conversations', name: 'Show Recent Conversations'},
                { key: 'favorites', name: 'Show Favorites' }
            ]
        }},
        { key: 'conversation', name: 'Conversation', iconProps: { iconName: 'ChatInviteFriend' } },
        { key: 'call', name: 'Call', iconProps: { iconName: 'Phone' } }
    ];

    FarCommands = () => (
        <div className="font-size-regular d-flex flex-row align-items-center">
            <Spinner className={"px-3 "} />
            <Icon iconName="SkypeCircleCheck"
                className={"ms-icon-regular mr-3 color-success "} />
            <IconButton className="ms-icon-regular" iconProps={{ iconName: "Info" }} />
            <IconButton iconProps={{ iconName: "MoreVertical" }} className="ms-icon-regular" />
        </div>
    );

    render() {
        return (
            <div className="chat-topbar">
                <div className="d-flex justify-space-between bg-primary-grey-light">
                    <CommandBar className="flex-grow-1" items={this._getItems()} />
                    <div className="right-commands px-3 d-flex">
                        <this.FarCommands />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ChatTopbar)