import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Spinner, SearchBox, ContextualMenuItemType, CommandBar, IconButton } from 'office-ui-fabric-react'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import DateUtils from '../../../../helpers/DateUtils'

import './DataSpaceMainContent.scss'

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

    _onFilter = (text) => {
        console.log(text);
        this.setState({
            rootFiles: text ? this._allItems.filter(i => i.fileName.toLowerCase().indexOf(text) > -1) : this._allItems
        });
    }
    
    _onCheckboxChange(e, isChecked) {
        console.log(`The option has been changed to ${isChecked}.`);
    }

    ListHeader = () => {
        return (
            <thead>
                <tr>
                    <th className="list-col">
                        <Checkbox className="list-item-select" onChange={this._onCheckboxChange} />
                    </th>
                    <th className="list-col"><Icon iconName="FileTemplate" className="list-item-file" /></th>
                    <th className="list-col">Name</th>
                    <th className="list-col">More</th>
                    <th className="list-col">Upload date</th>
                    <th className="list-col">Dir name</th>
                    <th className="list-col">Dir path</th>
                    <th className="list-col">Last modified</th>
                    <th className="list-col">Type</th>
                    <th className="list-col">Owner</th>
                </tr>
            </thead>
        );
    }

    ListBody() {
        return (
            <tbody>
                {this.state.rootFiles.map((item, k) =>
                    <tr key={k} className={`list-row`}>
                        <td className="list-col">
                            <Checkbox className="list-item-select" onChange={this._onCheckboxChange} />
                        </td>
                        <td className="list-col">
                            <Icon iconName={getFileTypeIconProps({ extension: item.fileName.split('.').pop() }).iconName}
                                className="list-item-file" />
                        </td>
                        <td className="list-col filename-col">
                            <a href={item.path} target="_blank" className="ml-2">{item.fileName}</a>
                        </td>
                        <td className="list-col">{item.more}</td>
                        <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
                        <td className="list-col">{item.dirName}</td>
                        <td className="list-col">{item.dirPath}</td>
                        <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
                        <td className="list-col"><span className="badge badge-info">{item.mimeType.split('.').pop()}</span></td>
                        <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
                    </tr>
                )}
            </tbody>
        );
    }

    ListItemContext() {
        return (
            <div>
                <IconButton
                    iconProps={{ iconName: "MoreVertical" }} className="file-more-context"
                    menuProps={{
                        shouldFocusOnMount: true,
                        items: [
                            {
                                key: 'newItem',
                                iconProps: { iconName: 'Add' },
                                text: 'New' 
                            },
                            {
                                key: 'upload',
                                onClick: () => { this.setState({ showCallout: true }); },
                                iconProps: { iconName: 'Upload', style: { color: 'salmon' } },
                                text: 'Upload (Click for popup)',
                                title: 'Upload a file'
                            },
                            {
                                key: 'divider_1',
                                itemType: ContextualMenuItemType.Divider
                            },
                            {
                                key: 'share',
                                iconProps: { iconName: 'Share' },
                                text: 'Share'
                            },
                            {
                                key: 'print',
                                iconProps: { iconName: 'Print' },
                                text: 'Print'
                            },
                            {
                                key: 'music',
                                iconProps: { iconName: 'MusicInCollectionFill' },
                                text: 'Music'
                            }
                        ]
                    }}
                />
            </div>
        );
    }

    htmlOnLoad() {
        return (
            <div className="d-flex h-100 justify-content-center align-items-center">
                <Spinner label={DataSpaceMainContent.loadingMsg} labelPosition="right" />
            </div>
        );
    }

    htmlOnDataReceived() {
        return (
            <div>
                <SearchBox placeholder="Search by name"
                    onChange={newValue => this._onFilter(newValue)} underlined={true} />
                <div className="table-responsive data-space-table ">
                    <table className="table list-root small">
                        {this.ListHeader()}
                        {this.ListBody()}
                    </table>
                </div>
            </div>
        );
    }

    render() 
    {
        if (this.state.loading) 
        {
            return(this.htmlOnLoad());
        } 
        else 
        {
            return(this.htmlOnDataReceived());
        }
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceMainContent)