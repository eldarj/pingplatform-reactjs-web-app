import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { Spinner, SearchBox, ContextualMenuItemType, DefaultButton, PrimaryButton, IconButton } from 'office-ui-fabric-react'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'

import ListItemContext from './ListItemContext'

import DateUtils from '../../../../helpers/DateUtils'

import './DataSpaceMainContent.scss'

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

    componentDidMount() {
        this.hubConnection.on(`DeleteFileMetadataSuccess${window.randomGen}`, (filename) => {
            this.setState(prevState => (
                { 
                  loading: false, 
                  directory: {
                      ...prevState.directory,
                      nodes: this.state.directory.nodes.filter(obj => obj.fileName !== filename)
                  } 
                }
              ));
        });
        this.hubConnection.on(`DeleteFileMetadataFail${window.randomGen}`, (filename, reasonMsg) => {
            console.log("Delete file fail: " + filename + reasonMsg);
        });
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

    actionDeleteItem = (items) => {
        this.setState({ loading: true });
        //TODO: Axios delete
        setTimeout(() => {
            axios.delete('https://localhost:44380/api/dataspace/eldarja/files/' + items[0].name,
            {
              headers: {
                "AppId": window.randomGen,
                "OwnerPhoneNumber": this.state.accountVM.phoneNumber
              },
              withCredentials: false
            })
            .then((e) => {
              console.log(e);
              console.log("AXIOS:Delete Then");
            })
            .finally((e) => {
              console.log(e);
              console.log("AXIOS:Delete Finaly");
            })
            .catch((e) => {
              console.log(e);
              console.log("AXIOS:Delete Catch");
            });
      
          }, 1500);
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
                    <th className="list-col">Visibility</th>
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

    ListBody = () => (
        <tbody>
            {this.state.directory.nodes.map((item, k) => 
                item.nodeType === "File" ? this.ListFile(item, k) : this.ListDirectory(item, k)
            )}
        </tbody>
    );

    ListFile = (item, k) => (
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
            <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
            <td className="list-col">
                <ListItemContext item={item} onDelete={() => this.actionDeleteItem([item])}/>
            </td>
            <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
            <td className="list-col">{item.dirName}</td>
            <td className="list-col">{item.dirPath}</td>
            <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
            <td className="list-col"><span className="badge badge-info bg-primary-blue">
                {item.mimeType && item.mimeType.includes('.') ? item.mimeType.split('.').pop() : item.mimeType}
            </span></td>
            <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
        </tr>
    );

    traverseTo = (item) => {
        this.setState({
            loading: true,
            directory: item
        });
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000);
        console.log(this.directory);
    }

    ListDirectory = (item, k) => (
        <tr key={k} className={`list-row`}>
            <td className="list-col">
                <Checkbox className="list-item-select" onChange={this._onCheckboxChange} checked={item.checked} />
            </td>
            <td className="list-col">
                <Icon iconName="Directory" className="list-item-file" />
            </td>
            <td className="list-col filename-col">
                <span onClick={() => this.traverseTo(item)} className="filename ml-2">{item.name}</span>
            </td>
            <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
            <td className="list-col">
                <ListItemContext item={item} onDelete={() => this.actionDeleteItem([item])}/>
            </td>
            <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
            <td className="list-col">{item.dirName}</td>
            <td className="list-col">{item.dirPath}</td>
            <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
            <td className="list-col"><span className="badge badge-info bg-primary-blue">Directory</span></td>
            <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
        </tr>
    );

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
            <SearchBox placeholder="Search by name" className="my-2"
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