import React, { Component } from 'react'
import DateUtils from '../../../helpers/DateUtils'
import { ButtonDropdown } from '../../shared/ButtonDropdownComponent/ButtonDropdown'
import { connect } from 'react-redux'

import './ProfileHeader.scss'

class ProfileHeader extends Component {

    constructor(props) {
        super(props);

        let defaultAvatar = '/images/user/default/profile_avatar_placeholder.png';
        let defaultCover = 'https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg';

        this.state = { 
            accountModel: null,
            profileProps: {
                avatarUrl: defaultAvatar,
                avatarClasses: 'default-avatar',
                coverUrl: defaultCover,
                coverClasses: 'default-cover'
            } 
        }
        
        if (props.account != null) {
            props.account.dateRegistered = DateUtils.formatISODate(props.account.dateRegistered);
            this.state.accountModel = props.account;

            if(this.state.accountModel.avatarUrl != null) 
            {
                this.state.profileProps.avatarUrl = this.state.accountModel.avatarUrl;
                this.state.profileProps.avatarClasses = '';
            }

            if(this.state.accountModel.coverUrl != null) 
            {
                this.state.profileProps.coverUrl = this.state.accountModel.coverUrl;
                this.state.profileProps.coverClasses = '';
            }
        }
    }

    onUploadPhotoClick = () => {
        console.log('ye');
    }

    renderProfileHeaderHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div>
                <div className={"cover-container "  + this.state.profileProps.coverClasses}>
                    <div className="cover-wrap">
                        <div id="cover_photo"
                            className="cover-img"
                            style={{ backgroundImage: `url("${this.state.profileProps.coverUrl}")` }}>
                        </div>
                    </div>
                </div>
                <div className={"container avatar-container d-flex mb-2 " + this.state.profileProps.avatarClasses}>
                    <div className="avatar-wrap row">
                        <div className="col-sm">
                            <div className="avatar-wrap rounded shadow position-relative ">
                                <a className="image-popup-vertical-fit" href="/test" title="test">
                                    <div id="avatar"
                                        className="avatar-img rounded box-shadow-xs"
                                        style={{ backgroundImage: `url("${this.state.profileProps.avatarUrl}")` }}>
                                    </div>
                                </a>
                                <ButtonDropdown className="btn-option btn-option-sm"
                                    btnClassName="btn-sm btn-light"
                                    btnIconClassName="fas fa-cog">
                                    <button className="dropdown-item" onClick={this.onUploadPhotoClick}>Upload photo</button>
                                </ButtonDropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderProfileHeaderHtml(this.state.accountModel)
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileHeader)