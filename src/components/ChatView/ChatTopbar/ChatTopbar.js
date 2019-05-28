import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    Modal, CommandBar, IconButton, Icon,
    Spinner, Pivot, PivotItem,
    PrimaryButton, DefaultButton 
} from 'office-ui-fabric-react'

class ChatTopbar extends Component {
    commandBarItems = [
        { key: 'view', name: 'View', iconProps: { iconName: 'ActivityFeed' },  subMenuProps: {
            isBeakVisible: false,
            items: [{ key: 'contacts', name: 'Show Contacts' }, 
            	{ key: 'conversations', name: 'Show Recent Conversations'},
                { key: 'favorites', name: 'Show Favorites' }]
        }},
        { key: 'conversation', name: 'Conversation', iconProps: { iconName: 'ChatInviteFriend' } },
        { key: 'call', name: 'Call', iconProps: { iconName: 'Phone' } }
    ];

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            isModalVisible: false,
            newContact: { name: "", contactPhoneNumber: "" }
        }
    }
    
    componentDidMount() {
        this.props.childAddContactModalHandler(() => this.setState({ isModalVisible: true }) );
    }

    FarCommands = () => (
        <div className="font-size-regular d-flex flex-row align-items-center">
            <Spinner className={"px-3 "} />
            <Icon iconName="SkypeCircleCheck"
                className={"ms-icon-regular mr-3 color-success "} />
            <IconButton className="ms-icon-regular" iconProps={{ iconName: "Info" }} />
            <IconButton iconProps={{ iconName: "MoreVertical" }} className="ms-icon-regular" 
            	onClick={ () => this.setState({ isModalVisible: true }) }/>
        </div>
    );

    _setNewContactName = (text) => this.setState(prevState => ({ 
        newContact: { ...prevState.newContact, name: text }
    }));

	_setNewContactPhone = (phone) => this.setState(prevState => ({ 
        newContact: { ...prevState.newContact, contactPhoneNumber: phone }
    }));

    render() {
        return (
            <div className="chat-topbar">
                <div className="d-flex justify-space-between">
                    <CommandBar className="flex-grow-1" items={this.commandBarItems} />
                    <div className="right-commands px-3 d-flex">
                        <this.FarCommands />
                    </div>
                    <Modal isOpen={this.state.isModalVisible} onDismiss={ () => this.setState({ isModalVisible: false }) }
                        isBlocking={false} className="file-preview-modal">
                        <div className="dialog-modal-body">
                        <div className="dialog-header">
                            <p className="dialog-title">Add new contact</p>
                        </div>
                        <div className="dialog-inner">
                            <div className="dialog-content">
                            <Pivot>
                                <PivotItem
                                    headerText="Phone number"
                                    headerButtonProps={{
                                    'data-order': 1,
                                    'data-title': 'My Files Title'
                                    }}>
                                    <p className="mb-1">Add using phone number</p>
                                    <div>
                                        <input type="text" placeholder="Name" className="input-border-shadow w-100 mb-1" 
                                            value={this.state.newContact.name} onChange={ (e) => this._setNewContactName(e.target.value) }/>
                                        <input type="text" placeholder="Phone number" className="input-border-shadow w-100" 
                                            value={this.state.newContact.contactPhoneNumber} onChange={ (e) => this._setNewContactPhone(e.target.value) }/>
                                    </div>
                                </PivotItem>
                                <PivotItem headerText="Email">
                                    <p className="mb-1">Add using email address</p>
                                    <div>
                                        <input type="text" placeholder="Email" className="input-border-shadow w-100"/>
                                    </div>
                                </PivotItem>
                                </Pivot>
                            </div>
                            <div className="dialog-actions text-right">
                            <PrimaryButton onClick={ () => this.props.onAddNewContact(this.state.newContact.name, this.state.newContact.contactPhoneNumber)}
                                text="Add" />
                            <DefaultButton onClick={ () => this.setState({ isModalVisible: false }) }
                                text="Cancel" />
                            </div>
                        </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ChatTopbar)