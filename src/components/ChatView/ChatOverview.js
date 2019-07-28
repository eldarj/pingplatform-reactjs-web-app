import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addContact, addMessage } from '../../redux/actions'

import * as signalr from '@aspnet/signalr'

import { ProgressIndicator } from 'office-ui-fabric-react'
import ChatContactsSidebar from './ChatContactsSidebar/ChatContactsSidebar';
import ChatTopbar from './ChatTopbar/ChatTopbar';
import ChatMain from './ChatMain/ChatMain';

import './ChatOverview.scss'

class ChatOverview extends Component {
    hubConnection = null;
    reduxDispatch = null;
    
    constructor(props) {
        super(props);
        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            loading: false,
            accountVM: null,
            mainConversationContact: null
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        this.hubConnection = new signalr.HubConnectionBuilder()
            .withUrl('https://localhost:44380/chathub', { accessTokenFactory: () => this.state.accountVM.token })
            .build();
    }

    componentDidMount() {
        this.hubConnection
            .start()
            .then(() => { this.signalRHubOnConnected() })
            .catch(() => console.log('Error establishing connection.'));

        this.hubConnection.on(`ReceiveMessage${this.state.accountVM.phoneNumber}`, (newMessage) => {
            this.reduxDispatch(addMessage(this.state.mainConversationContact, newMessage));
        });

        this.hubConnection.on(`AddContactResponse`, (contactResponse) => {
            if (contactResponse.messageCode === "CONTACT_ADDED_SUCCESSFULLY") {
                this.reduxDispatch(addContact(contactResponse.dto));
            } else {
                alert(contactResponse.message);
            }
        });
    }

    onSendMessage = (newMessage) => {
        this.reduxDispatch(addMessage(this.state.mainConversationContact, newMessage));
        this.hubConnection
            .invoke("SendMessage", this.state.accountVM.phoneNumber, newMessage)
            .catch(err => {
                console.error(`Error on: SendMessage`);
                console.error(err);
            });
    }

    // Don't do this everytime the page is refreshed
    signalRHubOnConnected = () => {
        this.setState({ loading: true });
        this.hubConnection
            .invoke("RequestContacts")
            .catch(err => {
                    console.error(`Error on: RequestContacts()`);
                    console.error(err);
            });
    }

    onAddNewContact = (contactName, contactPhoneNumber) => {
        let newContactDto = { phoneNumber: this.state.accountVM.phoneNumber, contactName: contactName, contactPhoneNumber: contactPhoneNumber }
        console.log(newContactDto);
        this.hubConnection
            .invoke("AddContact", newContactDto)
            .catch(err => {
                console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
                console.error(err);
            });
    }

    onUpdateContact = (contactDto) => {
        this.hubConnection
            .invoke("UpdateContact", contactDto)
            .catch(err => {
                console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
                console.error(err);
            });
    }

    onConversationSelected = (contact) => {
        this.setState({ mainConversationContact: contact });
    }

    setStateLoading = (isChildLoading) => {
        this.setState({ loading: isChildLoading });
    }

    NoContactSelected = () => (
        <div className="chat-main start-conversation">
            <div className="profile-pic profile-placeholder rounded-perspective shadow-sm profile-md mr-auto ml-auto mb-3"></div>
            <p className="lead font-secondary-color text-center">
                Select a contact to start a conversation, or add a new contact.
            </p>
            <button className="btn btn-brand-light border shadow-sm" onClick={ () => this.openNewContactModal() }>
                Add new
            </button>
        </div>
    );

    render() {
        let mainContent;
        if (this.state.mainConversationContact) {
            mainContent = <ChatMain contact={this.state.mainConversationContact}
                onSendMessage={this.onSendMessage}
                onUpdateContact={this.onUpdateContact}
                loading={this.state.loading}/>
        } else {
            mainContent = <this.NoContactSelected />
        }
        return (
            <div className="position-relative">
                <div className="block bg-primary-grey-light">
                    <ChatTopbar onAddNewContact={this.onAddNewContact}
                    	childAddContactModalHandler={ handler => this.openNewContactModal = handler } />
                    <ProgressIndicator className={"upload-progress-bar " + (this.state.loading ? "visible" : "invisible")} />
                </div>
                <div className="row">
                    <div className="col-md-3 bg-light sidebar pr-0">
                        <ChatContactsSidebar 
                            isStateLoading={this.setStateLoading}
                            hubConnection={this.hubConnection} 
                        	onConversationSelected={this.onConversationSelected}/>
                    </div>
                    <div className="col-md-9 d-flex flex-column pl-0">
                        {mainContent}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({ account: state.account });
export default connect(mapStateToProps)(ChatOverview)