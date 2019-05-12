import React, { Component } from 'react'
import { connect } from 'react-redux'

import './DataSpaceMainContent.scss'

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { getFileTypeIconProps } from '@uifabric/file-type-icons';

class DataSpaceMainContent extends Component {
    static loadingMsg = "Please wait while we load your data...";

    hubConnection = null;
    _allItems = [];


    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            dataSpaceRootFiles: [],
            dataSpaceDirs: [],
            showCallout: false
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.hubConnection != null) {
            this.hubConnection = props.hubConnection;
        }
    }

    componentDidMount() {
        this.hubConnection.on(`RequestFilesMetaDataSuccess${window.randomGen}`, (receivedMessage) => {
            console.log(receivedMessage);
            for (let i = 0; i < receivedMessage.rootFiles.length; i++) {
                receivedMessage.rootFiles[i].more = <this.ListItemContext />;
            }
            this._allItems = receivedMessage.rootFiles;
            this.setState({ loading: false, rootFiles: receivedMessage.rootFiles });
        });

        this.hubConnection.on(`RequestFilesMetaDataFail${window.randomGen}`, (receivedMessage) => {
            console.log("Request fail: ");
            console.log(receivedMessage);
        });
    }

    _onFilter = (e, text) => {
        this.setState({
            rootFiles: text ? this._allItems.filter(i => i.fileName.toLowerCase().indexOf(text) > -1) : this._allItems
        });
    }


    ListHeader = () => {
        return (
            <div className="list-head d-flex flex-row">
                <div className="list-col">
                    <Checkbox className="list-item-select" onChange={this._onCheckboxChange} />
                </div>
                <div className="list-col">File name</div>
                <div className="list-col">More</div>
                <div className="list-col">Creation name</div>
                <div className="list-col">Dir name</div>
                <div className="list-col">Dir path</div>
                <div className="list-col">Last modified</div>
                <div className="list-col">Mime type</div>
                <div className="list-col">Path</div>
                <div className="list-col">Owner</div>
            </div>
        );
    }

    ListBody() {
        return(
            <div className="list-body d-flex flex-column">
                {this.state.rootFiles.map((item, k) =>
                    <div key={k} className={`list-col`}>
                        {this.ListItem(item, k)}
                    </div>
                )}
            </div>
        );
    }

    _onCheckboxChange(e, isChecked) {
        console.log(`The option has been changed to ${isChecked}.`);
    }
    ListItem(item, index) {
        return (
            <div className={`list-row list-row-${index} d-flex flex-row`}>
                <div className="list-col">
                    <Checkbox className="list-item-select" onChange={this._onCheckboxChange} />
                </div>
                <div className="list-col">
                    <Icon iconName={getFileTypeIconProps({extension: item.fileName.split('.').pop()}).iconName} 
                        className="list-item-file" />
                </div>
                <div className="list-col">{item.fileName}</div>
                <div className="list-col">{item.more}</div>
                <div className="list-col">{item.creationName}</div>
                <div className="list-col">{item.dirName}</div>
                <div className="list-col">{item.dirPath}</div>
                <div className="list-col">{item.lastModifiedTime}</div>
                <div className="list-col">{item.mimeType}</div>
                <div className="list-col">{item.path}</div>
                <div className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</div>
            </div>
        );
    }

    ListItemContext() {
        return (
            <div>
                Contextual menu
            </div>
        );
    }
    
    htmlOnLoad() {
        return (
            <div className="d-flex h-100 justify-content-center align-items-center">
                <i className="fas fa-circle-notch">{this.loadingMsg}</i>
            </div>
        );
    }

    htmlOnDataReceived() {
        return (
            <div>
                <label htmlFor="fitlerInput">Fitler by name:</label>
                <input id="filterInput" onChange={this._onFilter} style={{ maxWith: 300 }} />
                <div className="list-root d-flex flex-column small">
                    {this.ListHeader()}
                    {this.ListBody()}
                </div>
            </div>
        );
    }

    render() {
        let content;

        if (this.state.loading) {
            content = this.htmlOnLoad();
        } else {
            content = this.htmlOnDataReceived();
        }

        return (content);
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceMainContent)