import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SearchBox, Spinner, IconButton } from 'office-ui-fabric-react'
import ImageUtils from '../../../helpers/ImageUtils'

import { setContacts } from '../../../redux/actions'

import './ChatContactsSidebar.scss'

class ChatContactsSidebar extends Component {
    hubConnection = null;
    reduxDispatch = null;
    _allContacts = [];

    constructor(props) {
        super(props);
        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            accountVM: null,
            activeContactList: "contactname",
            displayedContacts: []
        }

        if (props.hubConnection != null) {
            this.hubConnection = props.hubConnection;
        }
        
        if (props.account != null) {
            console.log(props.account);
            this.state.accountVM = props.account;
        }

        if (props.contacts != null) {
            this._allContacts = props.contacts;
            this.state.displayedContacts = props.contacts;
        } 
        
        if (props.contacts.length > 0) {
            this._selectedContact = props.contacts[0];
            props.onConversationSelected(this._selectedContact);
        }
    }

    componentDidMount() {
        this.hubConnection.on(`RequestContactsSuccess`, (contacts) => {
            setTimeout(() => {
                this.props.isStateLoading(false);
                this.reduxDispatch(setContacts(contacts));
            }, 1000);
        });
    }

    componentDidUpdate(prevProps) {
        // if (this.props.contacts != null && !window.lolodash.isEqual(this.props.contacts, this._allContacts)) {
        if (prevProps.contacts !== this.props.contacts) {
            this._allContacts = this.props.contacts;
            this.props.onConversationSelected(this.props.contacts.filter(c => c.contactPhoneNumber === this._selectedContact.contactPhoneNumber)[0]);
            this.setState({ displayedContacts: this.contactsNavFilter(this.state.activeContactList) });
        }
    }
    
    _onContactsFilter = (text) => {
        let contactList = this.contactsNavFilter(this.state.activeContactList);
        this.setState({
            searchFilter: text,
            displayedContacts: text ? 
            	contactList.filter(c => (c.contactName).toLowerCase().indexOf(text.toLowerCase()) > -1) : 
            	contactList
        });
    }

    contactsNavFilter = (type) => {
        switch (type) {
            case "favorites":
                return this._allContacts.filter(c => c.isFavorite);
                
            case "recent":
                return this._allContacts.slice(0).sort((a,b) => a.messages[a.messages.length -1].ticks - b.messages[b.messages.length -1].ticks );
                
            case "contactname":
                return this._allContacts;
                
            default:
            	return this._allContacts;
        }
    }

    displayFavoriteContacts = () => {
        this.setState({
            searchFilter: "",
            activeContactList: "favorites",
            displayedContacts: this.contactsNavFilter("favorites")
    	});
    }
    
    displayRecentContacts = (a, b) => {
        this.setState({
            searchFilter: "",
            activeContactList: "recent",
            displayedContacts: this.contactsNavFilter("recent")
        })
    }
    
    displayContactsOrderByContactName = () => {
        this.setState({
            searchFilter: "",
            activeContactList: "contactname", 
            displayedContacts: this.contactsNavFilter("contactname")
        });
    }
    
    ContactsNav = () => (
        <div className="contacts-list-nav">
            <div className={"contacts-nav-icon " + (this.state.activeContactList === "recent" ? "active" : "")}
            	onClick={ this.displayRecentContacts }>
                <IconButton className="ms-icon-regular" iconProps={{iconName:'Recent'}} />
            </div>
            <div className={"contacts-nav-icon " + (this.state.activeContactList === "contactname" ? "active" : "")}
            	onClick={ this.displayContactsOrderByContactName }>
                <IconButton className="ms-icon-regular" iconProps={{iconName:'Contact'}} />
			</div>
            <div className={"contacts-nav-icon " + (this.state.activeContactList === "favorites" ? "active" : "")}
            	onClick={ this.displayFavoriteContacts }>
                <IconButton className="ms-icon-regular" iconProps={{iconName:'FavoriteStar'}} />
			</div>
    	</div>
    )

    PopFlashDiv = (props) =>  {
        let elements = document.getElementsByClassName(props.className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].animate([{ background: '#fff', color: '#ccc' }, { background: 'transparent', color: '#000', }], {  duration: 600 });
        }
        return (
            <div className={props.className}>
                {props.children}
            </div>
        )
    }

    ContactsList = () => {
        if (this.state.displayedContacts === null || typeof(this.state.displayedContacts) === "undefined" || this.state.displayedContacts.length === 0) {
            return (                
	            <div className="p-3 font-secondary-color font-body">
                You don't have any {this.state.activeContactList === "favorites" ? "favorites" : ""} contacts yet. Go ahead, and add some!
                </div>
            )
        }
        return (
            <this.PopFlashDiv className="contacts-list flex-column">
                {this.state.displayedContacts.map((contact, k) => (
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
                            value={this.state.searchFilter} onChange={newValue => this._onContactsFilter(newValue)} 
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

const mapStateToProps = state => ({ account: state.account, contacts: state.contacts });
export default connect(mapStateToProps)(ChatContactsSidebar)