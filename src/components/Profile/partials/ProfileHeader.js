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
            profileDisplayProps: {
                avatarUrl: defaultAvatar,
                avatarClasses: 'default-avatar',
                coverUrl: defaultCover,
                coverClasses: 'default-cover'
            },
            profileUploadProps: {
                avatarFile: null,
                avatarDataUrl: '',
                loading: false
            },
            coverUploadProps: {
                coverFile: null,
                coverPreviewUrl: '',
                loading: false
            }
        }

        if (props.account != null) {
            props.account.dateRegistered = DateUtils.formatISODate(props.account.dateRegistered);
            this.state.accountModel = props.account;

            if (this.state.accountModel.avatarUrl != null) {
                this.state.profileDisplayProps.avatarUrl = this.state.accountModel.avatarUrl;
            }

            if (this.state.accountModel.coverUrl != null) {
                this.state.profileDisplayProps.coverUrl = this.state.accountModel.coverUrl;
                this.state.profileDisplayProps.coverClasses = '';
                this.state.profileDisplayProps.avatarClasses = '';
            }
        }
    }

    onUploadButtonClick = (e) => {
        this.refs.avatarInput.click();
    }

    onUploadFileSelected = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState(prevState => (
                {
                    profileUploadProps: {
                        ...prevState.profileUploadProps,
                        loading: true
                    }
                }
            ));
            setTimeout(() => {
                this.setState({
                    profileUploadProps: {
                        avatarFile: file,
                        avatarDataUrl: reader.result,
                        loading: false
                    }
                });
            }, 1500);
        }

        reader.readAsDataURL(file); // triggers on load end
    }

    avatarChangesSave = () => {
        console.log(this.state.profileUploadProps.file);
        console.log(this.state.profileUploadProps.avatarDataUrl);
        this.setState(prevState => (
            {
                profileDisplayProps: {
                    ...prevState.profileDisplayProps,
                    avatarUrl: prevState.profileUploadProps.avatarDataUrl
                }
            }
        ));
        this.setState({
            profileUploadProps: {
                avatarFile: null,
                avatarDataUrl: '',
                loading: false
            }
        })
    }

    avatarChangesDiscard = () => {
        this.setState({
            profileUploadProps: {
                avatarFile: null,
                avatarDataUrl: '',
                loading: false
            }
        })
    }

    avatarChanges = () => {
        if(!this.state.profileUploadProps.loading && this.state.profileUploadProps.avatarFile) {
            return(
                <div className="btn-group position-absolute bottom-0 w-100">
                    <button className="btn btn-xs btn-success" onClick={this.avatarChangesSave}>Save</button>
                    <button className="btn btn-xs btn-danger" onClick={this.avatarChangesDiscard}>Discard</button>
                </div>
            );
        }
        return;
    }

    renderProfileHeaderHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        
        let avatarUrl = this.state.profileDisplayProps.avatarUrl;
        let loadingAvatarClass = this.state.profileUploadProps.loading ? 'loading-div-bg' : '';

        if (this.state.profileUploadProps.avatarDataUrl.length > 0) {
            avatarUrl = this.state.profileUploadProps.avatarDataUrl;
        }

        return (
            <div>
                <div className={"cover-container " + this.state.profileDisplayProps.coverClasses}>
                    <div className="cover-wrap">
                        <div id="cover_photo"
                            className="cover-img"
                            style={{ backgroundImage: `url("${this.state.profileDisplayProps.coverUrl}")` }}>
                        </div>
                    </div>
                </div>
                <div className={"container avatar-container d-flex mb-2 " + this.state.profileDisplayProps.avatarClasses}>
                    <div className="avatar-wrap row">
                        <div className="col-sm">
                            <div className="avatar-wrap rounded shadow position-relative ">
                                <div>
                                    <div id="avatar"
                                        className={"avatar-img rounded box-shadow-xs " + loadingAvatarClass}
                                        style={{ backgroundImage: `url("${avatarUrl}")` }}>
                                        {this.avatarChanges()}
                                    </div>
                                </div>
                                <ButtonDropdown className="btn-option btn-option-sm"
                                    btnClassName="btn-sm btn-light"
                                    btnIconClassName="fas fa-cog">
                                    <button className="dropdown-item" 
                                        onMouseDown={this.onUploadButtonClick}>Upload photo</button>
                                </ButtonDropdown>
                                <input id="avatarFile" name="file" className="d-none"
                                    type="file" 
                                    ref="avatarInput" 
                                    onChange={this.onUploadFileSelected}
                                />
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