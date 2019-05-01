import React, { Component } from 'react'
import ProfileHeader from './partials/ProfileHeader'
import ProfileInfo from './partials/ProfileInfo'
import DateUtils from '../../helpers/DateUtils'
import { connect } from 'react-redux'

import './ProfileView.scss'

class ProfileView extends Component {

    constructor(props) {
        super(props);

        this.state = { accountVM: null }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }
    }

    renderAccountHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div>
                <ProfileHeader/>
                <div className="settings-container container d-flex mb-2">
                    <div className="btn-group btn-group-sm ml-auto">
                        <a href="/" className="btn btn-light">
                            Feed
                        </a>
                        <a href="{{route('friends')}}" className="btn btn-light">
                            Prijatelji
                        </a>
                        <a href="/" className="btn btn-light">
                            Aktivnosti
                        </a>
                        <a href="/" className="btn btn-light">
                            Slike
                        </a>
                        <a href="/" className="btn btn-light">
                            Više informacija
                        </a>
                        <a href="/" className="btn btn-light">
                            <i className="fas fa-cog"></i>
                        </a>
                    </div>
                </div>
                <ProfileInfo/>
                <div className="container">
                    <div id="profile-settings-side" className="profile-settings-side my-3">
                        <div className="settings whileHidden">
                            <div className="d-flex">
                                <div className="settings-panel">
                                    <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                                        <div className="btn-group-vertical mr-2" role="group" aria-label="First group">
                                            <button data-section="#general-settings-panel" type="button" className="settings-nav-btn btn btn-light bg-dark text-white">General</button>
                                            <button data-section="#avatar-settings-panel" type="button" className="settings-nav-btn btn btn-light">Avatar</button>
                                            <button data-section="#cover-settings-panel" type="button" className="settings-nav-btn btn btn-light">Cover</button>
                                        </div>
                                    </div>
                                </div>
                                <form method="POST" action="/profile/update" encType="multipart/form-data">
                                    <input type="text" defaultValue="Testuserid" name="user_id" hidden />
                                    <div id="main-scroll-box" className="settings-forms flex-grow">
                                        <div id="general-settings-panel" className="settings-group form-group">
                                            <h3>Your alias</h3>
                                            <p>This will appear on your <mark>profile</mark>, and other users will see this when you write messages on <mark>chat</mark>.</p>
                                            <div className="input-group input-group-sm mb-4">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text small" id="btnGroupAddon">Alias</div>
                                                </div>
                                                <input type="text"
                                                    className="form-control"
                                                    rows="5"
                                                    name="name"
                                                    placeholder="Your alias"
                                                    defaultValue="Testusername" />
                                            </div>
                                            <h3>Your description</h3>
                                            <p>This will appear on your <mark>profile</mark>, and will be visible to all other users who visit.</p>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text small" id="btnGroupAddon">Description</div>
                                                </div>
                                                <textarea type="text"
                                                    className="form-control"
                                                    placeholder="Write something about yourself..."
                                                    rows="5"
                                                    defaultValue="Testdescription"
                                                    name="description"></textarea>
                                            </div>
                                        </div>
                                        <div id="avatar-settings-panel" className="settings-group form-group">
                                            <h3>Your avatar</h3>
                                            <p>Choose an <mark>avatar</mark> or upload one. This will be appear on your <mark>profile</mark> and as your <mark>user-icon</mark> visible on chat, visible to all other users</p>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text small" id="btnGroupAddon">Avatar</div>
                                                </div>
                                                <input type="file"
                                                    className="form-control"
                                                    name="avatar"
                                                    accept="image/x-png,image/jpeg" />
                                            </div>
                                        </div>
                                        <div id="cover-settings-panel" className="settings-group form-group">
                                            <h3>Your cover photo</h3>
                                            <p>This will appear on your <mark>profile</mark>, as a <mark>header cover</mark>.</p>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text small" id="btnGroupAddon">Cover</div>
                                                </div>
                                                <input type="file"
                                                    className="form-control"
                                                    name="cover_photo" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary mb-2">Save changes</button>
                                        <p className="small text-secondary">All of your data will be previewed in the left column, but not updated until you save the changes.</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    render() {
        return (
            this.renderAccountHtml(this.state.accountVM)
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileView)