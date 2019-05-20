import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { ContextualMenuItemType, IconButton } from 'office-ui-fabric-react'

import FilePreview from './FilePreview'

class ListItemContext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountVM: null,
            item: null,
            menuItems: [],
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

        if (this.props.item.nodeType === "File") {
            this.state.menuItems = [
                { key: 'preview', text: 'Preview', onClick: () => { this.onPreviewClicked() } },
                { key: 'download', text: 'Download' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                {
                    key: 'changeVisibility', text: this.state.item.private ?
                        'Change visibility to Public' :
                        'Change visibility to Private'
                },
                { key: 'share', text: 'Share' },
                { key: 'copyLink', text: 'Copy link' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                { key: 'rename', text: 'Rename' },
                { key: 'move', text: 'Move to' },
                { key: 'copy', text: 'Copy to' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                { key: 'delete', text: 'Delete', onClick: this.actionDelete.bind(this, this.props.item, "files") }
            ];
        }

        else if (this.props.item.nodeType === "Directory") {
            this.state.menuItems = [
                { key: 'details', text: 'Details' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                {
                    key: 'changeVisibility', text: this.state.item.private ?
                        'Change visibility to Public' :
                        'Change visibility to Private'
                },
                { key: 'share', text: 'Share' },
                { key: 'copyLink', text: 'Copy link' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                { key: 'rename', text: 'Rename' },
                { key: 'move', text: 'Move to' },
                { key: 'copy', text: 'Copy to' },
                { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
                { key: 'delete', text: 'Delete', onClick: this.actionDelete.bind(this, this.props.item, "directories") }
            ]
        }
    }

    componentDidMount() {
        if (this.onPreviewClicked) {
            this.props.childPreviewHandler(this.onPreviewClicked);
        }
    }
    
    componentDidUpdate() {
        if (this.onPreviewClicked) {
            this.props.childPreviewHandler(this.onPreviewClicked);
        }
    }

    actionDelete = (item, endpointByType) => {
        this.state.parentFunc.onDelete();
        let url = 'https://localhost:44380/api/dataspace/eldarja/' + endpointByType + '/' +
            (item.path ? item.path + '/' : '') + item.name;

        setTimeout(() => {
            axios.delete(url, {
                withCredentials: false,
                headers: {
                    "AppId": window.randomGen,
                    "OwnerPhoneNumber": this.state.accountVM.phoneNumber
                },
            }).then((e) => {
                console.log(e);
                console.log("AXIOS:Delete Then");
            });
        }, 1500);
    }

    ContextButton = () => (
        <IconButton iconProps={{ iconName: "MoreVertical" }} className="file-more-context"
            menuProps={{
                shouldFocusOnMount: true,
                items: this.state.menuItems
            }} />
    )

    render() {
        if (this.props.item.nodeType === "File") {
            return (
                <div>
                    <this.ContextButton />
                    <FilePreview item={this.props.item} 
                        childPreviewHandler={ handler => this.onPreviewClicked = handler }/>
                </div>
            )
        }
        else if (this.props.item.nodeType === "Directory") {
            return (
                <div>
                    <this.ContextButton />
                </div>
            )
        }
        return null;
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ListItemContext)