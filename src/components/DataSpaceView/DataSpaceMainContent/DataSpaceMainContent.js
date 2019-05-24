import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon, Spinner, SearchBox } from 'office-ui-fabric-react'

import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import ListItemContext from './ListItemContext/ListItemContext'
import DateUtils from '../../../helpers/DateUtils'
import FileUtils from '../../../helpers/FileUtils'
import './DataSpaceMainContent.scss'

// TODO: Try implementing this using routes? So we don't re-render this component based on state holding our directory objection,
//          --- but instead use routing
class DataSpaceMainContent extends Component {
    static loadingMsg = "Loading, please wait...";

    originalDirectory = {
        nodes: []
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchFilter: "",
            directory: {
                diskSize: '0',
                nodes: []
            }
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.directory != null) {
            this.state.directory = props.directory;
            this.originalDirectory = props.directory;
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.directory !== this.props.directory) {
            this.originalDirectory = this.props.directory;
            let cpyDir = Object.assign({}, this.originalDirectory);;
            if (this.state.searchFilter.length > 0) {
                cpyDir.nodes = cpyDir.nodes.filter(i => i.name.toLowerCase().indexOf(this.state.searchFilter) > -1);
            }
            this.setState({
                loading: false,
                directory: cpyDir
            });
        }
    }

    _onFilter = (text) => {
        this.setState(prevState => ({
            searchFilter: text,
            directory: {
                ...prevState.directory,
                nodes: text ? this.originalDirectory.nodes.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this.originalDirectory.nodes
            }
        }));
    }

    _onCheckAllItems = (isChecked) => {
        let allCheckboxes = document.getElementsByClassName("list-item-select");
        for (let i = 0; i < allCheckboxes.length; i++) {
            let inputEl = allCheckboxes[i].querySelector("input");
            
            if (inputEl.type === "checkbox") {
                inputEl.checked = isChecked;
            }
        }
        this.props.onCheckedItems(
            this.state.directory.nodes.map(i => { return { name: i.name, path: i.path, nodeType: i.nodeType } }), 
            isChecked
        );
    }

    _onCheckItem = (isChecked, item) => {
        if (!isChecked) {
            document.getElementById("checkAllBoxId").checked = false;
        }
        this.props.onCheckedItems([{ name: item.name, path: item.path, nodeType: item.nodeType }], 
            isChecked
        );
    }

    ListHeader = () => {
        return (
            <thead>
                <tr>
                    <th className="list-col text-center">
                        <div className="flatos-checkbox flatos-checkbox-primary centered">
                            <input type="checkbox" id="checkAllBoxId"
                                onChange={ (e) => this._onCheckAllItems(e.target.checked) } />
                        </div>
                    </th>
                    <th className="list-col text-center"><Icon iconName="FileTemplate" className="list-item-file" /></th>
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

    FileItem = (item, k) => {
        let onPreview = () => undefined;
        return (
            <tr key={k} className={`list-row`}>
                <td className="list-col text-center">
                    <div className="list-item-select flatos-checkbox flatos-checkbox-primary centered">
                        <input type="checkbox"
                            onChange={ (e) => { this._onCheckItem(e.target.checked, item) }} />
                    </div>
                </td>
                <td className="list-col text-center">
                    <Icon iconName={getFileTypeIconProps({ extension: item.name.split('.').pop() }).iconName}
                        className="list-item-file" />
                </td>
                <td className="list-col filename-col">
                    <span onClick={ () => onPreview() }
                        className="filename ml-2">{item.name}</span>
                </td>
                <td className="list-col">
                    <ListItemContext item={item} onDelete={() => this.setState({ loading: true })}
                        childPreviewHandler={ handler => onPreview = handler } />                    
                </td>
                <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
                <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
                <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
                <td className="list-col">
                    <span className="badge badge-info bg-primary-blue">
                        {FileUtils.getTypeDescription(item.name)}
                        {/* {item.mimeType && item.mimeType.includes('.') ? item.mimeType.split('.').pop() : item.mimeType} */}
                    </span>
                </td>
                <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
            </tr>
        )
    }

    DirectoryItem = (item, k) => (
        <tr key={k} className={`list-row`}>
            <td className="list-col text-center">
                <div className="list-item-select flatos-checkbox flatos-checkbox-primary centered">
                    <input type="checkbox"
                        onChange={ (e) => this._onCheckItem(e.target.checked, item)} />
                </div>
            </td>
            <td className="list-col text-center">
                <Icon iconName="Directory"
                    className="list-item-file" />
            </td>
            <td className="list-col filename-col">
                <span onClick={() => this.props.onTraverseToDir(item) }
                    className="filename ml-2">{item.name}</span>
            </td>
            <td className="list-col">
                <ListItemContext key={k} item={item} onDelete={() => { this.setState({ loading: true }); }} />
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
                <div className="flex-grow-1">
                    <div className="loading-div">
                        <Spinner label={DataSpaceMainContent.loadingMsg} labelPosition="right" />
                    </div>
                    <SearchBox ref="listSearch" placeholder="Search by name" className="data-space-list-search"
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
        
        if (this.originalDirectory.nodes.length === 0) {
            return (
                <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
                    <span className="label-primary">There's nothing here, please upload some resources.</span>
                </div>
            );
        }
        else {
            return (
                <div className="flex-grow-1">
                    <SearchBox placeholder="Search by name" className="data-space-list-search"
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