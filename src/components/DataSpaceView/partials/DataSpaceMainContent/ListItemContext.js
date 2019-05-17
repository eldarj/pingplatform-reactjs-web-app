import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { ContextualMenuItemType, IconButton } from 'office-ui-fabric-react'

class ListItemContext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountVM: null,
            item: null,
            parentFunc: {
                onDelete: null
            }
        }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }

        if (props.item) {
            this.state.item = props.item;
        } 

        if (props.onDelete) {
            this.state.parentFunc.onDelete = props.onDelete;
        }
    }

    componentDidUpdate() {
        this.state.parentFunc.onDelete = this.props.onDelete;
    }

    // Axios delete (single) file
    actionDeleteFile = (item) => {
        this.state.parentFunc.onDelete();
        let url = 'https://localhost:44380/api/dataspace/eldarja/files/' + 
            (item.path ? item.path + '/' : '') + item.name;

        setTimeout(() => {
            axios.delete(url,
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
    
    // Axios delete (single) directory
    actionDeleteDirectory = (item) => {
        this.state.parentFunc.onDelete();
        let url = 'https://localhost:44380/api/dataspace/eldarja/directories/' + 
            (item.path ? item.path + '/' : '') + item.name;

        setTimeout(() => {
            axios.delete(url,
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

    renderFileContext = () => (
    <div>
        <IconButton iconProps={{ iconName: "MoreVertical" }} className="file-more-context" 
            menuProps={{
                shouldFocusOnMount: true,
                items: [
                    { key: 'preview', text: 'Preview' },
                    { key: 'download', text: 'Download' },
                    { key: 'details', text: 'Details' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'changeVisibility', text: this.state.item.private ? 
                            'Change visibility to Public' : 
                            'Change visibility to Private' },
                    { key: 'share', text: 'Share' },
                    { key: 'copyLink', text: 'Copy link' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'rename', text: 'Rename' },
                    { key: 'move', text: 'Move to' },
                    { key: 'copy', text: 'Copy to' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'delete', text: 'Delete', onClick: this.actionDeleteFile.bind(this, this.props.item) }
                ]
            }} />
    </div>
    );

    renderDirectoryContext = () => (
    <div>
        <IconButton iconProps={{ iconName: "MoreVertical" }} className="file-more-context" 
            menuProps={{
                shouldFocusOnMount: true,
                items: [
                    { key: 'preview', text: 'Preview' },
                    { key: 'download', text: 'Download' },
                    { key: 'details', text: 'Details' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'changeVisibility', text: this.state.item.private ? 
                            'Change visibility to Public' : 
                            'Change visibility to Private' },
                    { key: 'share', text: 'Share' },
                    { key: 'copyLink', text: 'Copy link' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'rename', text: 'Rename' },
                    { key: 'move', text: 'Move to' },
                    { key: 'copy', text: 'Copy to' },
                    { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                    { key: 'delete', text: 'Delete', onClick: this.actionDeleteDirectory.bind(this, this.props.item) }
                ]
            }} />
    </div>
    );

    render() {
        let type = this.props.type;
        
        if (type === "directory") 
        {
            return (
                this.renderDirectoryContext()
            );
        } 
        else if (type === "file") {
            return (
                this.renderFileContext()
            );
        }

        return null;
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ListItemContext)