import React, { Component } from 'react'
import { connect } from 'react-redux'

import { IconButton, Icon, Spinner } from 'office-ui-fabric-react'

import ImageUtils from '../../../helpers/ImageUtils'
import DateUtils from '../../../helpers/DateUtils'

import { setContactIsFavorite, updateContactMessageTimeLabels } from '../../../redux/actions'

class ChatMain extends Component {
    reduxDispatch = null;
    constructor(props) {
        super(props);
        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            loading: false,
            contact: null,
            newMessageText: '',
            emojis: [],
            emojisVisible: false
        }

        if (this.props.contact !== null) {
            this.state.contact = this.props.contact;
        }
        if (this.props.emojis !== null) {
            this.state.emojis = this.props.emojis;
        }

        this.reduxDispatch(updateContactMessageTimeLabels(this.state.contact));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.emojis !== this.props.emojis) {
            this.setState({ emojis: this.props.emojis });
        }
        if (prevProps.contact !== this.props.contact) {
            this.setState({
                contact: this.props.contact
            });
        }
    }

    onSendMessage = () => {
        this.setState({ newMessageText: '' });
        this.props.onSendMessage({
            text: this.state.newMessageText,
            humanTimestamp: `just now`,
            receiver: this.state.contact.contactPhoneNumber,
            ticks: DateUtils.dotnetTicksNow()
        });
    }

    onEmojisPopup = () => {
        this.setState({ emojisVisible: !this.state.emojisVisible });
    }
    
    onEmojiSelected = (emojiHexCodePoint) => this.setState(prevState => ({
    	newMessageText: prevState.newMessageText + String.fromCodePoint('0x' + emojiHexCodePoint) 
    }));

    _removeFromFavorites = () => {
        let updatedContact = {...this.state.contact, isFavorite: false};
        this.setState({ contact: updatedContact });
        this.props.onUpdateContact(updatedContact);
        this.reduxDispatch(setContactIsFavorite(this.state.contact.contactPhoneNumber, false));
    }

    _addToFavorites = () => {
        let updatedContact = {...this.state.contact, isFavorite: true};
        this.setState({ contact: updatedContact });
        this.props.onUpdateContact(updatedContact);
        this.reduxDispatch(setContactIsFavorite(this.state.contact.contactPhoneNumber, true));
    }

    MainTopBar = () => {
        let optionButtons;
        if (this.state.contact.isFavorite) {
            optionButtons = <IconButton className="ms-icon-regular icon-gold context-button-no-arrow" iconProps={{ iconName: "FavoriteStar" }}
                menuProps={{ isBeakVisible: false, items: [{ key: 'removeFav', text: 'Remove from favorites', onClick: this._removeFromFavorites }] }} />
        } else {
            optionButtons = <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "AddFavorite" }}
                onClick={ this._addToFavorites } />
        }
        return (
            <div className="contact-holder">
                <div className="contact-left-holder">
                    <div className="profile-pic rounded-perspective"
                        style={{ backgroundImage: `url('${ImageUtils.getAvatarImage(this.state.contact.avatarImageUrl)}')` }}></div>
                </div>
                <div className="contact-right-holder">
                    <div className="contact-right-info">
                        <div className="person-name">{this.state.contact.contactName}</div>
                        <div className="person-phone-number">{this.state.contact.contactPhoneNumber}</div>
                        <div className="person-last-seen">Last seen 15 min</div>
                    </div>
                    <div className="font-size-regular d-flex flex-row align-items-center">
                        <Spinner className={"px-3 "} />
                        <Icon iconName="SkypeCircleCheck"
                            className={"ms-icon-regular mr-3 color-success "} />
                        {optionButtons}
                        <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Phone" }} />
                        <IconButton className="ms-icon-regular icon-grey" iconProps={{ iconName: "Video" }} />
                    </div>
                </div>
            </div>
        )
    }

    MainBody = () => {
        let bodyContent;
        if (this.state.contact.messages && this.state.contact.messages.length > 0) {
            bodyContent = this.state.contact.messages.map((msg, k) => {
                let nextMessage = this.state.contact.messages[k + 1];
                let isSquashed = nextMessage && msg.humanTimestamp === nextMessage.humanTimestamp && msg.receiver === nextMessage.receiver;

                return (
                    <div className={"msg-bubble-wrap " + (isSquashed ? "msg-squash" : "")} key={k}>
                        <div className={"msg-bubble " + (this.state.contact.contactPhoneNumber !== msg.receiver ? "" : "msg-me")}>
                            <div className="msg-time">{msg.humanTimestamp}</div>
                            <div className="msg" style={{ zIndex: this.state.contact.messages.length - k }}>{msg.text}</div>
                        </div>
                    </div>
                )
            })
        } else {
            bodyContent = <p className="no-msgs">Say hi!</p>
        }
        return (
            <div className="chat-body-wrap">
                <div className="chat-body">
                    {bodyContent}
                </div>
            </div>
        )
    }

    MainBottomBar = () => (
        <div className="chat-bottom-bar-wrap">
            <div className="chat-bottom-bar">
                <div className="input-holder">
                    <textarea required rows="1" className="input-border-shadow mr-2" value={this.state.newMessageText}
                        onChange={(e) => { this.setState({ newMessageText: e.target.value }) }}></textarea>
                    <div className="placeholder-msg">Type a message...</div>
                    <IconButton className="ms-icon-regular icon-bg-brand rounded-circle pl-2" iconProps={{ iconName: "Send" }}
                        onClick={this.onSendMessage}
                        disabled={this.state.newMessageText.length === 0 ? true : false} />
                </div>
                <div className="options-holder">
                    <div className="left-options">
                        <IconButton className="ms-icon-regular icon-grey" 
                        	iconProps={{ iconName: "Emoji" }}
                            onClick={this.onEmojisPopup} />
                        <div className={"emojis-wrapper " + (this.state.emojisVisible ? "visible" : "hidden")} >
                            {this.state.emojis.map((emojiCategory, k, i) =>
                                <div key={k} className="emoji-category">
                                    <div className="emoji-category-name">
                                        {emojiCategory.name}
                                    </div>
                                    <div className="emoji-category-items">
                                        {emojiCategory.emojis.map((emoji, k) =>
                                            <div className="emoji-item" onClick={ () => this.onEmojiSelected(emoji.hexCodePoint) }
                                            	key={k}>{String.fromCodePoint('0x' + emoji.hexCodePoint)}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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

    Loading = () => (
        <div className="chat-main">
            <div className="loading-div">
                <Spinner label="Loading..." labelPosition="right" />
            </div>
        </div>
    )

    render() {
        import('./ChatMain.scss');

        if (this.state.loading) {
            return <this.Loading />
        }

        return <this.Conversation />
    }
}

export default connect()(ChatMain)