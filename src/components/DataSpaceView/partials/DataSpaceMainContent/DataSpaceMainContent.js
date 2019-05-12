import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Spinner, SearchBox, ContextualMenuItemType, DefaultButton, PrimaryButton, IconButton } from 'office-ui-fabric-react'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import { ListItemContext } from './ListItemContext'

import DateUtils from '../../../../helpers/DateUtils'

import './DataSpaceMainContent.scss'

class DataSpaceMainContent extends Component {
    static loadingMsg = "Please wait while we load your data...";

    hubConnection = null;
    fileUploadInputRef = null;
    _allItems = [];


    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rootFiles: []
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.hubConnection != null) {
            this.hubConnection = props.hubConnection;
        }

        this._allItems = props.rootFiles;
        this.state.rootFiles = props.rootFiles;
    }


    componentDidUpdate(prevProps) {
        if (prevProps.rootFiles !== this.props.rootFiles) {
            this._allItems = this.props.rootFiles;
            this.setState({ loading:false, rootFiles: this.props.rootFiles });
        }
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
                            <Checkbox className="list-item-select" onChange={this._onCheckboxChange} checked={item.checked} />
                        </td>
                        <td className="list-col">
                            <Icon iconName={getFileTypeIconProps({ extension: item.fileName.split('.').pop() }).iconName}
                                className="list-item-file" />
                        </td>
                        <td className="list-col filename-col">
                            <a href={item.path} target="_blank" className="ml-2">{item.fileName}</a>
                        </td>
                        <td className="list-col"><ListItemContext /></td>
                        <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
                        <td className="list-col">{item.dirName}</td>
                        <td className="list-col">{item.dirPath}</td>
                        <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
                        <td className="list-col"><span className="badge badge-info bg-primary-blue">{item.mimeType.split('.').pop()}</span></td>
                        <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
                    </tr>
                )}
            </tbody>
        );
    }

    htmlOnLoad = () => (
        <div className="d-flex h-100 justify-content-center align-items-center">
            <Spinner label={DataSpaceMainContent.loadingMsg} labelPosition="right" />
        </div>
    );
    

    htmlOnNoFiles = () => (
        <div className="d-flex h-100 justify-content-center align-items-center flex-column">
            <span className="label-primary">Drive empty. Please upload some resources first!</span>
        </div>
    );

    htmlOnDataReceived = () => (
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

    render() {
        if (this.state.loading) {
            return this.htmlOnLoad()
        }

        if (this._allItems.length === 0) {
            return this.htmlOnNoFiles()
        }
        else {
            return this.htmlOnDataReceived()
        }
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceMainContent)