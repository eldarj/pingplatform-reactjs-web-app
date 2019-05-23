import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SearchBox, TooltipHost } from 'office-ui-fabric-react'

import './ChatContactsSidebar.scss'

class ChatContactsSidebar extends Component {
    _listedContacts = [];

    constructor(props) {
        super(props);

        this._listedContacts = [
            { firstname: "Jon", lastname: "Fisher", phoneNumber: "+387 62 005 152", 
                profile: { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Alessandro_Del_Piero_in_2014.jpg/220px-Alessandro_Del_Piero_in_2014.jpg" }, 
                active: false, lastSeen: "15 mins ago", messages: [{text: "Yeah, I know, but I never even tried that one out. How was it?"}] },
            { firstname: "Ela", lastname: "Dvornik", phoneNumber: "+387 62 005 152", 
                profile: { imageUrl: "http://wardrobefocus.com/wp-content/uploads/2018/03/2018-Hipster-Fashion-Trends-For-Women-37.jpg" }, 
                active: false, lastSeen: "3 hours ago", messages: [{text: "Ok, thanks again. If you need that again, let me now."}] },
            { firstname: "Sabaha", lastname: "Jahijagić", phoneNumber: "+387 62 005 152", 
                profile: { imageUrl: "https://pkimgcdn.peekyou.com/92fec4fb8c1c686d87c0f38156fbf1b5.jpeg" }, 
                active: false, lastSeen: "yesterday", messages: [{text: "Haha, I was watchin that right now - how did you like it?"}] },
            { firstname: "Samir", lastname: "Nasri", phoneNumber: "+387 62 005 152", 
                profile: { imageUrl: "https://design.printexpress.co.uk/wp-content/uploads/2016/02/01-avatars.jpg" }, 
                active:false, lastSeen: "4 days ago", messages: [{text: "you there no?"}] },
        ];

        this.state = {
            contactsSearchFilter: "",
            contacts: this._listedContacts
        }
    }

    _onContactsFilter = (text) => {
        this.setState({
            searchFilter: text,
            contacts: text ? this._listedContacts.filter(c => (c.firstname + " " + c.lastname).toLowerCase().indexOf(text.toLowerCase()) > -1) : 
                this._listedContacts
        });
    }

    ContactsList = () => (
        <div className="contacts-list flex-column">
            {this.state.contacts.map((contact, k) => (
                <div key={k} className="contact-holder d-flex flex-row contact align-items-center"
                    onClick={ () => this.props.onConversationSelected(contact) }>
                    <div className="contact-left-holder">
                        <div className="profile-pic rounded-perspective " 
                            style={{ backgroundImage: `url('${contact.profile.imageUrl}')` }}></div>
                    </div>
                    <div className="contact-right-holder flex-grow-1 ml-2">
                        <div>
                            <div className="person-name">{contact.firstname} {contact.lastname}</div>
                            <div className="person-last-msg">{contact.messages[contact.messages.length - 1].text}</div>
                            <div className="last-msg-preview">{contact.messages[contact.messages.length - 1].text}</div>
                        </div>
                        <div className="person-last-seen">Last seen {contact.lastSeen}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        return (
            <div className="chat-contacts-sidebar">
                <div className="chat-contacts-search-holder">
                    <SearchBox ref="contactsSearch" placeholder="Search contacts" className="contacts-searchbox input-border-shadow"
                        onChange={newValue => this._onContactsFilter(newValue)} 
                    />
                </div>
                <this.ContactsList />
                <div className="px-3 mt-4 mb-1 text-muted">
                    <h6>Storage</h6>
                    5GB out of 10GB
            </div>
                <div className="px-3 mt-4 mb-1 text-muted">
                    <h6>Groups</h6>
                    <p className="small">Groups help you share your content with specific people.</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ChatContactsSidebar)