import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ContextualMenu, Modal, Spinner, DefaultButton, PrimaryButton, Icon, IconButton } from 'office-ui-fabric-react'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import FileUtils from '../../../../helpers/FileUtils'
import DateUtils from '../../../../helpers/DateUtils'

class FilePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountVM: null,
            item: null,
            fileType: null,
            contentBlob: null,
            ObjectURL: null,
            IsPreviewModalVisible: false,
            IsPreviewLoading: false,
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.item) {
            this.state.item = props.item;
            this.state.fileType = FileUtils.getBasicType(props.item.mimeType);
        }
    }

    componentDidMount() {
        this.props.childPreviewHandler(this._openPreviewModal.bind(this));
    }

    componentDidUpdate() {
        if (this.state.item != this.props.item) {
            this.state.contentBlob = null;
            this.state.item = this.props.item;
            this.props.childPreviewHandler(this._openPreviewModal.bind(this));
        }
    }

    _closePreviewModal = () => {
        URL.revokeObjectURL(this.state.ObjectURL);
        this.setState({ IsPreviewModalVisible: false });
    }

    _openPreviewModal = () => {
        // If it not an img, vid or audio file, just display the preview without rendering any more content (icon is there by default)
        if (['image', 'video', 'audio'].indexOf(this.state.fileType) < 0) {
            this.setState({ 
                IsPreviewModalVisible: true
            });
            return;
        }

        // Check if we already have this content fetched from API, from earlier
        if (this.state.contentBlob) {
            this.setState({
                ObjectURL: URL.createObjectURL(this.state.contentBlob),
                IsPreviewModalVisible: true
            });
            URL.revokeObjectURL(this.state.ObjectURL);
            return;
        }

        // Otherwise, display a spinner icon and fetch data from API
        this._fetchFromApi();
    }

    _fetchFromApi = () => {
        this.setState({ 
            IsPreviewModalVisible: true, 
            IsPreviewLoading: true
        });

        let url = `https://localhost:44380/api/dataspace/eldarja/files/${this.state.item.path}/${this.state.item.name}`;
        fetch(url).then(response => {
            let rs = response.body;
            const reader = rs.getReader();
            return new ReadableStream({
                async start(controller) {
                    return pump();
                    async function pump() {
                        const { done, value } = await reader.read(); // value is Uint8array
                        // when we don't have any more data, close and release lock
                        if (done) { 
                            controller.close();
                            reader.releaseLock();
                            return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    }
                }
            })
        })
        // Create a new response & blob (promsise) out of the stream
        .then(rs => {
            let response = new Response(rs);
            let blob = response.blob();
            return blob;
        })
        .then(blob => {
            // Create a ObjectUrl and set it in state (blob aswell, because we dispose ObjectURL)
            setTimeout(() => {
                this.setState({
                    contentBlob: blob,
                    ObjectURL: URL.createObjectURL(blob),
                    IsPreviewLoading: false,
                });
            }, 500);
        })
        .catch(console.error);
    }

    _copyLink = () => {
        alert('set up a link to a resource first');
    }

    _share = () => {
    }

    _changeAccess = () => {
        console.log(this.state.item.private);
    }

    _downloadFile = () => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = URL.createObjectURL(this.state.contentBlob);
        a.download = this.state.item.name;
        a.click();
    }

    _resizeImage = () => {
        URL.revokeObjectURL(this.state.ObjectURL);
    }

    RenderFilePreview = () => {
        if (this.state.IsPreviewLoading) {
            return (
                <Spinner className="preview-spinner" />
            )
        }
        if (this.state.fileType === "image") {
            return (
                <div className="preview-img-wrap">
                    <div className="img-bg" style={{/*backgroundImage: 'url(' + this.state.ObjectURL + ')'*/}}></div>
                    {/* <img id="previewImg" src={this.state.ObjectURL} className="img-bg blurry-bg" alt={this.state.item.name}/> */}
                    <img id="previewImg" src={this.state.ObjectURL} className="preview-img" alt={this.state.item.name} 
                        onLoad={ this._resizeImage }
                         onContextMenu={ (e) => e.preventDefault() }/>
                </div>
            )
        } 
        if (this.state.fileType === "video") {
            return (
                <div className="position-relative">
                    <video id="previewVideo" src={this.state.ObjectURL} controls="controls" preload="none" 
                        className="preview-video" width="600" poster="/images/corporate/ping-600x335-dark.png"
                        onLoadedData={ e => e.target.play() } onContextMenu={ (e) => e.preventDefault() }>
                        <p>Your user agent does not support the HTML5 Video element.</p>
                    </video>
                </div>
            )
        }
        if (this.state.fileType === "audio") {
            return (
                <div className="audio-wrapper ping-poster">
                    <audio src={this.state.ObjectURL} onContextMenu={ (e) => e.preventDefault() }
                        onLoadedData={ e => e.target.play() } controls="controls" />
                </div>
            )
        }

        return (
            <div className="preview-icon">
                <Icon iconName={getFileTypeIconProps({ extension: this.state.item.name.split('.').pop() }).iconName}
                    className="icon" />
            </div>);
    }
    
    render() {
        return (
            <Modal isOpen={this.state.IsPreviewModalVisible} onDismiss={this._closePreviewModal}
                isBlocking={false} className="file-preview-modal">
                <div className="btn-option btn-option-sm btn-option-light"
                    onClick={this._closePreviewModal}>
                    <IconButton iconProps={{iconName: "ChromeClose"}} />
                </div>
                <div className="modal-body d-flex flex-column">
                    <div className="preview-content flex-grow-1">
                        <this.RenderFilePreview />
                    </div>
                    <div className="preview-details">
                        <div className="d-flex justify-content-between align-items-center">
                            <strong className="modal-title">{this.state.item.name}</strong>
                            <div className="d-flex flex-column">
                                <span className="badge badge-dark bg-primary-blue">
                                    {FileUtils.getTypeDescription(this.state.item.name)}
                                </span>
                                <span className="blockquote-footer">
                                    {FileUtils.getFileSizeForHumans(this.state.item.fileSizeInKB)}
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div className="info">
                            <p>
                                <strong>{this.state.item.ownerFirstname} {this.state.item.ownerLastname}</strong>
                                <span> - {DateUtils.formatISODate(this.state.item.creationTime)}</span>
                            </p>
                            <p>
                                <Icon iconName="Lock" />
                                {this.state.item.private ? 'Private' : 'Public'}
                            </p>
                            <DefaultButton text="Share" onClick={ this._share } className="primary"/>
                            <DefaultButton text="Copy link" onClick={ this._copyLink } className="primary"/>
                            <DefaultButton text="Change access" onClick={ this._changeAccess } className="primary"/>
                        </div>
                    </div>
                    <PrimaryButton text="Download" onClick={ this._downloadFile } className="primary"/>
                </div>
            </Modal>
        )
    }

}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(FilePreview)