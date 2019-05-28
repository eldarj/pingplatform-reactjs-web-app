import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SearchBox, Spinner, IconButton } from 'office-ui-fabric-react'
import ImageUtils from '../../../helpers/ImageUtils'

import { setContacts } from '../../../redux/actions'

import './ChatContactsSidebar.scss'

class ChatContactsSidebar extends Component {
    hubConnection = null;
    reduxDispatch = null;
    _listedContacts = [];

    constructor(props) {
        super(props);
        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            activeContactList: "contactname",
            contacts: []
        }

        if (props.contacts != null) {
            this._listedContacts = props.contacts;
            this.state.contacts = props.contacts;
        } 

        if (props.hubConnection != null) {
            this.hubConnection = props.hubConnection;
        }

        if (props.contacts.length > 0) {
            this._selectedContact = props.contacts[0];
            props.onConversationSelected(this._selectedContact);
        }
    }

    componentDidMount() {
        this.hubConnection.on(`RequestContactsSuccess${window.randomGen}`, (contacts) => {
            setTimeout(() => {
                this.props.isStateLoading(false);
                this.reduxDispatch(setContacts(contacts));
            }, 1000);
        });
    }

    componentDidUpdate() {
        if (this.props.contacts != null && !window.lolodash.isEqual(this.props.contacts, this._listedContacts)) {
            this._listedContacts = this.props.contacts;
            this.props.onConversationSelected(this.props.contacts.filter(c => c.contactPhoneNumber === this._selectedContact.contactPhoneNumber)[0]);
            this.setState({ contacts: this.props.contacts });
        }
    }
    
    _onContactsFilter = (text) => {
        this.setState({
            searchFilter: text,
            contacts: text ? this._listedContacts.filter(c => (c.contactName).toLowerCase().indexOf(text.toLowerCase()) > -1) : 
            this._listedContacts
        });
    }
    
    ContactsNav = () => (
        <div className="contacts-list-nav">
            <div className={"contacts-nav-icon " + (this.state.activeContactList === "recent" ? "active" : "")}
            	onClick={ this._orderContactsAsRecents }>
                <IconButton className="ms-icon-regular" iconProps={{iconName:'Recent'}} />
            </div>
            <div className={"contacts-nav-icon " + (this.state.activeContactList === "contactname" ? "active" : "")}
            	onClick={ this._orderByContactname }>
                <IconButton className="ms-icon-regular" iconProps={{iconName:'Contact'}} />
			</div>
    	</div>
    )
    
    _orderContactsAsRecents = (a, b) => {
        this.setState({ 
            activeContactList: "recent",
            contacts: this._listedContacts.slice(0).sort((a,b) => a.messages[a.messages.length -1].ticks - b.messages[b.messages.length -1].ticks )
        })
    }
    
    _orderByContactname = () => {
        this.setState({ activeContactList: "contactname", contacts: this._listedContacts });
    }
    
    PopFlashDiv = (props) =>  {
        let elements = document.getElementsByClassName(props.className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].animate([{ background: '#76d1f8' }, { background: 'transparent' }], {  duration: 600 });
        }
        return (
            <div className={props.className}>
                {props.children}
            </div>
        )
    }

    ContactsList = () => {
        return (
            <this.PopFlashDiv className="contacts-list flex-column">
                {this.state.contacts.map((contact, k) => (
                    <div key={k} className="contact-holder d-flex flex-row contact align-items-center"
                        onClick={ () => { this._selectedContact = contact; this.props.onConversationSelected(contact) } }>
                        <div className="contact-left-holder">
                            <div className="profile-pic rounded-perspective " 
                                style={{ backgroundImage: `url('${ImageUtils.getAvatarImage(contact.avatarImageUrl)}')` }}></div>
                        </div>
                        <div className="contact-right-holder flex-grow-1 ml-2">
                            <div>
                                <div className="person-name">{contact.contactName}</div>
                                <div className="person-last-msg">Hey</div>
                                <div className="last-msg-preview">Hey</div>
                            </div>
                            <div className="person-last-seen">Last seen 25 min</div>
                        </div>
                    </div>
                ))}
            </this.PopFlashDiv>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="chat-contacts-sidebar">
                    <div className="loading-div">
                        <Spinner label="Loading..." labelPosition="right" />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="chat-contacts-sidebar">
                    <div className="chat-contacts-search-holder">
                        <SearchBox ref="contactsSearch" placeholder="Search contacts" className="contacts-searchbox input-border-shadow"
                            onChange={newValue => this._onContactsFilter(newValue)} 
                        />
                    </div>
                    <this.ContactsNav />
                    <this.ContactsList />
                    <div className="px-3 mt-4 mb-1 text-muted">
                        <h6>Groups</h6>
                        <p className="small">Groups help you share your content with specific people.</p>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = state => ({ contacts: state.contacts });
export default connect(mapStateToProps)(ChatContactsSidebar)