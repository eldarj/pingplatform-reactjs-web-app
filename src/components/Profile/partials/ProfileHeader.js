import React, { Component } from 'react'
import { connect } from 'react-redux';
import { setAccountAction } from '../../../redux/actions';
import * as signalr from '@aspnet/signalr'

import LZString from 'lz-string'
import ButtonDropdown from '../../shared/ButtonDropdownComponent/ButtonDropdown'

import FileUtils from '../../../helpers/FileUtils'
import Imageutils from '../../../helpers/ImageUtils'

import './ProfileHeader.scss'

class ProfileHeader extends Component {
    hubConnection = null;
    reduxDispatch = null;
    maxFileSizeInKb = 5000;

    constructor(props) {
        super(props);

        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        let defaultAvatar = '/images/user/default/profile_avatar_placeholder.png';
        let defaultCover = 'https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg';

        this.state = {
            accountVM: null,
            profileDisplayProps: {
                avatarUrl: defaultAvatar,
                avatarClasses: 'default-avatar',
                coverUrl: defaultCover,
                coverClasses: 'default-cover'
            },
            profileUploadProps: {
                avatarFile: null,
                avatarDataUrl: '',
                avatarLoading: false,
                coverFile: null,
                coverDataUrl: '',
                coverLoading: false
            }
        }

        if (props.account != null) {
            this.state.accountVM = props.account;

            if (this.state.accountVM.avatarImageUrl != null) {
                this.state.profileDisplayProps.avatarUrl = this.state.accountVM.avatarImageUrl;
            }

            if (this.state.accountVM.coverImageUrl != null) {
                this.state.profileDisplayProps.coverUrl = this.state.accountVM.coverImageUrl;
                this.state.profileDisplayProps.coverClasses = '';
                this.state.profileDisplayProps.avatarClasses = '';
            }
        }
    }

    componentDidMount() {
        this.hubConnection = new signalr.HubConnectionBuilder()
            .withUrl('https://localhost:44380/accounthub')
            .build();
            
        this.hubConnection
            .start()
            .then(() => console.log('Connection started.'))
            .catch(() => console.log('Error establishing connection.'));

        this.hubConnection.on(`UpdateProfileFailed${window.randomGen}`, (receivedMessage) => {
            console.log("Request failed: ");
            console.log(receivedMessage);
        });

        this.hubConnection.on(`UpdateProfileSuccess${window.randomGen}`, (receivedMessage) => {
            console.log("Avatar updated: ");
            console.log(receivedMessage);

            this.reduxDispatch(setAccountAction(
                receivedMessage.createSession,
                receivedMessage.dateRegistered,
                receivedMessage.email,
                receivedMessage.firstname,
                receivedMessage.lastname,
                receivedMessage.phoneNumber,
                receivedMessage.token,
                receivedMessage.avatarImageUrl));
        })
    }

    // TODO
    updateProfile = () => {
        this.hubConnection
                .invoke("UpdateProfile", window.randomGen, this.state.accountVM)
                .catch(err => {
                    console.error(`Error on: UpdateProfile(${window.randomGen}, requestobj)`);
                    console.error(err);
                });
    }

    onUploadNewImage = (inputRef) => {
        inputRef.click();
    }

    // COVER IMAGE SELECTED
    onUploadCoverSelected = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        console.log(e.target);

        reader.onloadend = () => {
            this.setState(prevState => (
                {
                    profileUploadProps: {
                        ...prevState.profileUploadProps,
                        coverLoading: true
                    }
                }
            ));

            setTimeout(() => {
                this.setState(prevState => (
                    {
                        profileUploadProps: {
                            ...prevState.profileUploadProps,
                            coverFile: file,
                            coverDataUrl: reader.result,
                            coverLoading: false
                        }
                    }
                ));
            }, 1500);
        }

        reader.readAsDataURL(file); // triggers on load end
    }

    coverChangesSave = () => {
        this.setState(prevState => (
            {
                accountVM: {
                    ...prevState.accountVM,
                    coverBase64: prevState.profileUploadProps.coverDataUrl
                },
                profileDisplayProps: {
                    ...prevState.profileDisplayProps,
                    coverUrl: prevState.profileUploadProps.coverDataUrl
                }
            }
        ), () => {

            // TODO: UPDATE COVER AVATAR
            let postRequest = JSON.stringify({
                appId: window.randomGen,
                phoneNumber: this.state.accountVM.phoneNumber,
                firstname: this.state.accountVM.firstname,
                lastname: this.state.accountVM.lastname,
                base64Image: FileUtils.stripBase64Metadata(this.state.profileUploadProps.coverDataUrl),
                fileName: FileUtils.getFileName(this.state.profileUploadProps.coverFile),
                fileExtension: FileUtils.getFileExtension(this.state.profileUploadProps.coverFile),
            })

            console.log(postRequest);
            
            fetch('https://localhost:44380/api/account/profile/cover', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: postRequest
            })
        });

        // this.setState({
        //         profileUploadProps: {
        //             coverFile: null,
        //             coverLoading: false
        //         }
        // })
    }

    coverChangesDiscard = () => {
        this.setState(prevState => (
            {
                profileUploadProps: {
                    ...prevState.profileUploadProps,
                    coverFile: null,
                    coverDataUrl: '',
                    coverLoading: false
                }
            }
        ));
    }
    
    coverChanges = () => {
        if(!this.state.profileUploadProps.coverLoading && this.state.profileUploadProps.coverFile) {
            return(
                <div className="btn-group btn-group-sm position-absolute right-0 mt-3 mr-5 pr-2">
                    <button className="btn btn-success" onClick={this.coverChangesSave}>Save</button>
                    <button className="btn btn-danger" onClick={this.coverChangesDiscard}>Discard</button>
                </div>
            );
        }
        return;
    }

    // AVATAR IMAGE SELECTED
    onUploadAvatarSelected = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState(prevState => (
                {
                    profileUploadProps: {
                        ...prevState.profileUploadProps,
                        avatarLoading: true
                    }
                }
            ));

            setTimeout(() => {
                this.setState(prevState => (
                    {
                        profileUploadProps: {
                            ...prevState.profileUploadProps,
                            avatarFile: file,
                            avatarDataUrl: reader.result,
                            avatarLoading: false
                        }
                    }
                ));
            }, 1500);
        }

        reader.readAsDataURL(file); // triggers on load end
    }

    avatarChangesSave = () => {
        this.setState(prevState => (
            {
                accountVM: {
                    ...prevState.accountVM,
                    avatarBase64: prevState.profileUploadProps.avatarDataUrl
                },
                profileDisplayProps: {
                    ...prevState.profileDisplayProps,
                    avatarUrl: prevState.profileUploadProps.avatarDataUrl
                }
            }
        ), () => {

            // TODO: UPDATE PROFILE AVATAR
            let postRequest = JSON.stringify({
                appId: window.randomGen,
                phoneNumber: this.state.accountVM.phoneNumber,
                firstname: this.state.accountVM.firstname,
                lastname: this.state.accountVM.lastname,
                base64Image: FileUtils.stripBase64Metadata(this.state.profileUploadProps.avatarDataUrl),
                fileName: FileUtils.getFileName(this.state.profileUploadProps.avatarFile),
                fileExtension: FileUtils.getFileExtension(this.state.profileUploadProps.avatarFile),
            })

            console.log(postRequest);
            
            fetch('https://localhost:44380/api/account/profile/avatar', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: postRequest
            })
        });

        // this.setState({
        //         profileUploadProps: {
        //             avatarFile: null,
        //             avatarLoading: false
        //         }
        // })
    }

    avatarChangesDiscard = () => {
        this.setState(prevState => (
            {
                profileUploadProps: {
                    ...prevState.profileUploadProps,
                    avatarFile: null,
                    avatarDataUrl: '',
                    avatarLoading: false
                }
            }
        ));
    }
    
    avatarChanges = () => {
        if(!this.state.profileUploadProps.avatarLoading && this.state.profileUploadProps.avatarFile) {
            return(
                <div className="btn-group position-absolute bottom-0 w-100">
                    <button className="btn btn-xs btn-success" onClick={this.avatarChangesSave}>Save</button>
                    <button className="btn btn-xs btn-danger" onClick={this.avatarChangesDiscard}>Discard</button>
                </div>
            );
        }
        return;
    }

    render() {
        // TODO: handle this with an error page or authorize /profile
        if (this.state.accountVM == null) return (<p>no data</p>); 
        
        // let avatarUrl = Imageutils.checkImage(this.state.profileDisplayProps.avatarUrl, 
        //     '/images/user/default/profile_avatar_placeholder.png');
        // let coverUrl = Imageutils.checkImage(this.state.profileDisplayProps.coverUrl, 
        //     'https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg');
        let avatarUrl = this.state.profileDisplayProps.avatarUrl;
        let coverUrl = this.state.profileDisplayProps.coverUrl;

        let loadingAvatarClass = this.state.profileUploadProps.avatarLoading ? 'loading-div-bg' : '';
        let loadingCoverClass = this.state.profileUploadProps.coverLoading ? 'loading-div-bg' : '';

        if (this.state.profileUploadProps.avatarDataUrl.length > 0) {
            avatarUrl = this.state.profileUploadProps.avatarDataUrl;
        }
        if (this.state.profileUploadProps.coverDataUrl.length > 0) {
            coverUrl = this.state.profileUploadProps.coverDataUrl;
        }

        return (
            <div>
                <div className="cover-container">
                    <div className={"cover-wrap " + this.state.profileDisplayProps.coverClasses}>
                        <div id="cover_photo" 
                            className={"cover-img " + loadingCoverClass}
                            style={{ backgroundImage: `url("${coverUrl}")` }}>
                        {this.coverChanges()}
                        </div>
                        <ButtonDropdown className="btn-option btn-option-sm position-offset-md"
                            btnClassName="btn-sm btn-light"
                            btnIconClassName="fas fa-cog"
                            dropdownClassName="pull-left">
                            <button className="dropdown-item" 
                                onMouseDown={() => this.onUploadNewImage(this.refs.coverInput)}>
                                New cover photo
                            </button>
                        </ButtonDropdown>
                        <input id="coverFile" name="coverFile" className="d-none"
                            type="file" 
                            ref="coverInput" 
                            accept="image/*"
                            onChange={this.onUploadCoverSelected}/>
                    </div>
                </div>
                <div className={"container avatar-container d-flex mb-2 " + this.state.profileDisplayProps.avatarClasses}>
                    <div className="row mt-4">
                        <div className="col-sm">
                            <div className="avatar-wrap rounded position-relative mr-8">
                                <div id="avatar"
                                    className={"avatar-img rounded box-shadow-md " + loadingAvatarClass}
                                    style={{ backgroundImage: `url("${avatarUrl}")` }}>
                                    {this.avatarChanges()}
                                    <ButtonDropdown className="btn-option btn-option-sm position-offset-sm"
                                        btnClassName="btn-sm btn-light"
                                        btnIconClassName="fas fa-cog">
                                        <button className="dropdown-item" 
                                            onMouseDown={() => this.onUploadNewImage(this.refs.avatarInput)}>
                                            New profile photo
                                        </button>
                                    </ButtonDropdown>
                                </div>
                                <input id="avatarFile" name="avatarFile" className="d-none"
                                    type="file" 
                                    ref="avatarInput" 
                                    accept="image/*"
                                    onChange={this.onUploadAvatarSelected}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileHeader)