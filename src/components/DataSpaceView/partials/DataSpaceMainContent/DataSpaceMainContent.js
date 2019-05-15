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

        this.hubConnection.on(`DeleteDirectoryMetadataSuccess${window.randomGen}`, (directoryPath) => {
            let dirName = directoryPath.split('/').pop();
            console.log(dirName);
            // TODO: Remove this dir from the current list but check if we are updating all the dir obj references in memory)
            if (dirName) {
                this.setState(prevState => (
                    { 
                      loading: false, 
                      directory: {
                          ...prevState.directory,
                          nodes: this.state.directory.nodes.filter(obj => obj.name !== directoryPath)
                      }
                    }
                  ));
            }
        });
        this.hubConnection.on(`DeleteDirectoryMetadataFail${window.randomGen}`, (directoryPath, reasonMsg) => {
            console.log("Delete file fail: " + directoryPath + reasonMsg);
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

    actionDeleteFile = (items) => {
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

    actionDeleteDirectory = (items) => {
        this.setState({ loading: true });
        //TODO: Axios delete - check for directory path
        console.log(items[0].path);
        let directoryPath = items[0].path.replace('https://localhost:44380/dataspace/eldarja/', '');
        setTimeout(() => {
            axios.delete('https://localhost:44380/api/dataspace/eldarja/directories/' + directoryPath,
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
                <ListItemContext item={item} type="file" onDelete={() => this.actionDeleteFile([item])}/>
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

    ListDirectory = (item, k) => (
        <tr key={k} className={`list-row`}>
            <td className="list-col">
                <Checkbox className="list-item-select" onChange={this._onCheckboxChange} checked={item.checked} />
            </td>
            <td className="list-col">
                <Icon iconName="Directory" className="list-item-file" />
            </td>
            <td className="list-col filename-col">
                <span onClick={() => this.traverseToDir(item)} className="filename ml-2">{item.name}</span>
            </td>
            <td className="list-col">{item.private ? 'Private' : 'Public'}</td>
            <td className="list-col">
                <ListItemContext item={item} type="directory" onDelete={() => this.actionDeleteDirectory([item])}/>
            </td>
            <td className="list-col">{DateUtils.formatISODate(item.creationTime)}</td>
            <td className="list-col">{item.dirName}</td>
            <td className="list-col">{item.dirPath}</td>
            <td className="list-col">{DateUtils.formatISODate(item.lastModifiedTime)}</td>
            <td className="list-col"><span className="badge badge-info bg-primary-blue">Directory</span></td>
            <td className="list-col">{item.ownerFirstname + " " + item.ownerLastname}</td>
        </tr>
    );

    traverseToDir = (dir) => {
        this.setState({
            loading: true,
            directory: dir
        });
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 250);
        this.props.onTraverseToDir(dir);
    }

    htmlOnLoad = () => (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <Spinner label={DataSpaceMainContent.loadingMsg} labelPosition="right" />
        </div>
    );
    

    htmlOnNoFiles = () => (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
            <span className="label-primary">Drive empty. Please upload some resources first!</span>
        </div>
    );

    htmlOnDataReceived = () => (
        <div className="flex-grow-1">
            <SearchBox placeholder="Search by name" className="ml-auto my-2"
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