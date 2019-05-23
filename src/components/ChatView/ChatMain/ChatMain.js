import React, { Component } from 'react'
import { connect } from 'react-redux'

import { IconButton, Icon, Spinner,
    Modal, Pivot, PivotItem, Label,
    PrimaryButton, DefaultButton, MaskedTextField
} from 'office-ui-fabric-react'

import './ChatMain.scss'

class ChatMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contact: null,
            loading: false,
            newContactModalVisible: true
        }

        if (this.props.contact !== null) {
            this.state.contact = this.props.contact;
        }
    }

    componentDidMount() {
        
    }

    componentDidUpdate() {
        if (this.props.contact && this.state.contact != this.props.contact) {
            this.setState({
                contact: this.props.contact
            });
        }
    }

    _closeDialog = () => {
        this.setState({ newContactModalVisible: false });
    }

    NoContactSelected = () => (
        <div className="chat-main start-conversation">
            <div className="profile-pic profile-placeholder rounded-perspective shadow-sm profile-md mr-auto ml-auto mb-3"></div>
            <p className="lead font-secondary-color text-center">Select a contact to start a conversation, or add a new contact.</p>
            <button className="btn btn-brand-light border shadow-sm" onClick={() => this.setState({ newContactModalVisible: true })}>Add new</button>
            <Modal isOpen={this.state.newContactModalVisible} onDismiss={this._closeDialog}
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
                                <input type="text" placeholder="Phone number" className="input-border-shadow w-100"/>
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
                      <PrimaryButton onClick={() => {
                          alert('he')
                        }}
                        text="Add" />
                      <DefaultButton onClick={this._closeDialog}
                        text="Cancel" />
                    </div>
                  </div>
                </div>
            </Modal>
        </div>
    );

    MainTopBar = () => (
        <div className="contact-holder">
            <div className="contact-left-holder">
                <div className="profile-pic rounded-perspective"
                    style={{ backgroundImage: `url('${this.state.contact.profile.imageUrl}')` }}></div>
            </div>
            <div className="contact-right-holder">
                <div className="contact-right-info">
                    <div className="person-name">{this.state.contact.firstname} {this.state.contact.lastname}</div>
                    <div className="person-phone-number">{this.state.contact.phoneNumber}</div>
                    <div className="person-last-seen">Last seen {this.state.contact.lastSeen}</div>
                </div>
                <div className="font-size-regular d-flex flex-row align-items-center">
                    <Spinner className={"px-3 "} />
                    <Icon iconName="SkypeCircleCheck"
                        className={"ms-icon-regular mr-3 color-success "} />
                    <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "AddFavorite" }} />
                    <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Phone" }} />
                    <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Video" }} />
                </div>
            </div>
        </div>
    );

    MainBody = () => (
        <div className="chat-body-wrap">
            <div className="chat-body">
                <div className="msg-bubble-wrap">
                    <div className="msg-bubble">
                        <div className="msg-time">15:05</div>
                        <div className="msg">Hey there!</div>
                    </div>
                </div>
                <div className="msg-bubble-wrap">
                    <div className="msg-bubble">
                        <div className="msg-time">2 min</div>
                        <div className="msg">How you doin?</div>
                    </div>
                </div>
                <div className="msg-bubble-wrap">
                    <div className="msg-bubble msg-me">
                        <div className="msg-time">Now</div>
                        <div className="msg">Great! How about you?</div>
                    </div>
                </div>
            </div>
        </div>
    );

    MainBottomBar = () => (
        <div className="chat-bottom-bar-wrap">
            <div className="chat-bottom-bar">
                <div className="input-holder">
                    <textarea type="text" className="input-border-shadow" required></textarea>
                    <div className="placeholder-msg">Type a message...</div>
                </div>
                <div className="options-holder">
                    <div className="left-options">
                        <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Emoji" }} />
                    </div>
                    <div className="right-options">
                        <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "PhotoCollection" }} />
                        <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Microphone" }} />
                    </div>
                </div>
            </div>
        </div>
    );

    Conversation = () => (
        <div className="chat-main conversation">
            <this.MainTopBar />
            <this.MainBody />
            <this.MainBottomBar />
        </div>
    );

    render() {
        if (this.state.loading) {
            return (
                <div className="chat-main">
                    <div className="loading-div">
                        <Spinner label="Loading..." labelPosition="right" />
                    </div>
                </div>
            )
        }

        if (this.state.contact) {
            return (
                <this.Conversation />
            )
        }

        return (
            <this.NoContactSelected />
        )
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ChatMain)