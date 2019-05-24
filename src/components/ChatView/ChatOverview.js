import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ProgressIndicator } from 'office-ui-fabric-react'

import ChatContactsSidebar from './ChatContactsSidebar/ChatContactsSidebar';
import ChatTopbar from './ChatTopbar/ChatTopbar';
import ChatMain from './ChatMain/ChatMain';

import './ChatOverview.scss'

class ChatOverview extends Component {
    hubConnection = null;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainConversationContact: null
        }

        // this.state.mainConversationContact = { firstname: "Jon", lastname: "Fisher", phoneNumber: "+387 62 005 152", 
        // profile: { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Alessandro_Del_Piero_in_2014.jpg/220px-Alessandro_Del_Piero_in_2014.jpg" },
        // active: false, lastSeen: "15 mins ago", messages: [{text: "Yeah, I know, but I never even tried that one out. How was it?"}] };
    }

    onConversationSelected = (contact) => {
        console.log(contact);
        this.setState({
            mainConversationContact: contact
        });
    }

    render() {
        setTimeout(() => {
            console.log(this.onConversationSelected);
        }, 5000);
        return (
            <div className="position-relative">
                <div className="block">
                    <ChatTopbar />
                    <ProgressIndicator className={"upload-progress-bar " + (this.state.loading ? "visible" : "invisible")} />
                </div>
                <div className="row">
                    <div className="col-md-2 bg-light sidebar pr-0">
                        <ChatContactsSidebar onConversationSelected={this.onConversationSelected}/>
                    </div>
                    <div className="col-md-10 d-flex flex-column pl-0">
                        <ChatMain contact={this.state.mainConversationContact}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account
});

export default connect(mapStateToProps)(ChatOverview)