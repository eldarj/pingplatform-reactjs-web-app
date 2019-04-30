import React, { Component } from 'react'
import DateUtils from '../../helpers/DateUtils'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

class ProfileView extends Component {

    constructor(props) {
        super(props);

        this.state = { accountModel: null }

        if (props.account != null) {
            props.account.dateRegistered = DateUtils.formatISODate(props.account.dateRegistered);
            this.state.accountModel = props.account;
        }
    }

    renderAccountHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div>
                <div className="cover-container">
                    <div className="cover-wrap">
                        <div id="cover_photo"
                            className="cover-img"
                            style={{ backgroundImage: "url('http://localhost/images/users/profiles/default/covers/default.png')" }}></div>
                    </div>
                </div>
                <div className="container avatar-container d-flex mb-2">
                    <div className="avatar-wrap row">
                        <div className="col-sm">
                            <div className="avatar-wrap rounded p-2 card border shadow">
                                <a className="image-popup-vertical-fit" href="/test" title="test">
                                    <div id="avatar"
                                        className="avatar-img"
                                        style={{ backgroundImage: "url('http://localhost/images/users/profiles/default/icon/default.png')" }}></div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="settings-button d-flex flex-row ml-auto">
                        <div className="friendship-settings-wrap" data-ajax-onload data-ajax-target="friendship-settings" data-ajax-action="testingajaxsomelink" data-ajax-method="get">
                            <div id="friendship-settings" className="d-flex flex-row align-items-center">
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
                            </div>
                        </div>
                        <div id="settings-button">
                            <button className="btn btn-light">
                                <i className="fas fa-cog"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container profile-data d-flex flex-column">
                    <span className="kbd h5 m-1">{account.firstname + " " + account.lastname}</span>
                    <div className="d-flex">
                        <div className="m-1 small child-el-blocks kbd flex-grow-1">
                            <strong>Phone number</strong>
                            <strong>Email</strong>
                            <strong>Date joined</strong>
                        </div>
                        <div className="m-1 small child-el-blocks kbd flex-grow-1">
                            <span>{account.phoneNumber}</span>
                            <span>{account.email}</span>
                            <span>{account.dateRegistered}</span>
                        </div>
                    </div>
                </div>
                <div className="container d-flex flex-column profile-body-container">
                    <div id="profile-preview-side" className="profile-preview-side my-3">
                        <div className="card p-3">
                            <h2 id="name">
                                Testname
                        </h2>
                            <p className="lead">
                                Email: <span>Testmail</span>
                            </p>
                            <p className="description ml-1 font-italic"
                                id="description">
                                Testdescription
                        </p>
                            <p className="small writer ml-1">@testusername</p>
                        </div>
                    </div>
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
                                <form method="POST" action="/profile/update" enctype="multipart/form-data">
                                    <input type="text" value="Testuserid" name="user_id" hidden />
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
                                                    value="Testusername" />
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
                                                    name="description">Testdescription</textarea>
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
            <div className="my-3">
                <div>
                    <div className="container">
                        <h1>Profile</h1>
                    </div>
                    <hr /><br/>
                    {this.renderAccountHtml(this.state.accountModel)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileView)