import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { Checkbox, Icon, Spinner, SearchBox, ContextualMenuItemType, DefaultButton, PrimaryButton, IconButton } from 'office-ui-fabric-react'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import ListItemContext from './ListItemContext'
import DateUtils from '../../../../helpers/DateUtils'
import './DataSpaceMainContent.scss'

// TODO: Try implementing this using routes? So we don't re-render this component based on state holding our directory objection,
//          --- but instead use routing
class DataSpaceMainContent extends Component {
    static loadingMsg = "Loading, please wait...";

    hubConnection = null;
    _allItems = [];

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            directory: {
                diskSize: '0',
                nodes: []
            }
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.hubConnection != null) {
            this.hubConnection = props.hubConnection;
        }

        if (props.directory != null) {
            this.state.directory = props.directory;
            this._allItems = props.directory.nodes;
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.directory.nodes !== this.props.directory.nodes) {
            this._allItems = this.props.directory.nodes;
            this.setState({ loading: false, directory: this.props.directory });
        }
    }

    _onFilter = (text) => {
        console.log(text);
        this.setState(prevState => (
            {
                directory: {
                    ...prevState.directory,
                    nodes: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems
                }
            }
        ));
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
                    <th className="list-col">Visibility</th>
                    <th className="list-col">Upload date</th>
                    <th className="list-col">Last modified</th>
                    <th className="list-col">Type</th>
                    <th className="list-col">Owner</th>
                </tr>
            </thead>
        );
    }

    ListBody = () => (
        <tbody>
            {this.state.directory.nodes.map((item, k) => 
                item.nodeType === "File" ? this.FileItem(item, k) : this.DirectoryItem(item, k)
            )}
        </tbody>
    );

    FileItem = (item, k) => (
        <tr key={k} className={`list-row`}>
            <td className="list-col">
                <Checkbox className="list-item-select" onChange={this._onCheckboxChange} checked={item.checked} />
            </td>
            <td className="list-col">
                <Icon iconName={getFileTypeIconProps({ extension: item.name.split('.').pop() }).iconName}
                    className="list-item-file" />
            </td>
            <td className="list-col filename-col">
                <a href={item.path} target="_blank" className="filename ml-2">{item.name}</a>
            </td>
            <td className="list-col">
                <ListItemContext item={item} type="file" 
                    onDelete={ () => this.setState({ loading: true }) }/>
            </td>
            <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
            <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
            <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
            <td className="list-col"><span className="badge badge-info bg-primary-blue">
                {item.mimeType && item.mimeType.includes('.') ? item.mimeType.split('.').pop() : item.mimeType}
            </span></td>
            <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
        </tr>
    );

    DirectoryItem = (item, k) => (
        <tr key={k} className={`list-row`}>
            <td className="list-col">
                <Checkbox className="list-item-select" 
                    onChange={this._onCheckboxChange} 
                    checked={item.checked} />
            </td>
            <td className="list-col">
                <Icon iconName="Directory" 
                    className="list-item-file" />
            </td>
            <td className="list-col filename-col">
                <span onClick={() => this.props.onTraverseToDir(item)} 
                    className="filename ml-2">{item.name}</span>
            </td>
            <td className="list-col">
                <ListItemContext key={k} item={item} type="directory" 
                    onDelete={ () => { this.setState({ loading: true }); } }/>
            </td>
            <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
            <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
            <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
            <td className="list-col"><span className="badge badge-info bg-primary-blue">Directory</span></td>
            <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
        </tr>
    );

    render() {
        if (this.state.loading) {
            return (
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <Spinner label={DataSpaceMainContent.loadingMsg} labelPosition="right" />
                </div>
            );
        }

        if (this._allItems.length === 0) {
            return(
                <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
                    <span className="label-primary">There's nothing here, please upload some resources.</span>
                </div>
            );
        }
        else {
            return (
                <div className="flex-grow-1">
                    <SearchBox placeholder="Search by name" className="ml-auto my-2"
                        onChange={newValue => this._onFilter(newValue)} underlined={true} />
                    <div className="table-responsive data-space-table ">
                        <table className="table list-root small">
                            <this.ListHeader />
                            <this.ListBody />
                        </table>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceMainContent)