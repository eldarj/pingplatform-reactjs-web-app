
import React, { Component } from 'react'
import { ContextualMenuItemType, IconButton } from 'office-ui-fabric-react'

export default class ListItemContext extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            item: props.item,
            onDelete: props.onDelete
        }
    }

    htmlForFile = () => (
    <div>
        <IconButton
            iconProps={{ iconName: "MoreVertical" }} className="file-more-context" menuProps={{
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
                    { key: 'delete', text: 'Delete', onClick: this.state.onDelete }
                ]
            }} />
    </div>
    );

    htmlForDirectory = () => (
    <div>
        <IconButton
            iconProps={{ iconName: "MoreVertical" }} className="file-more-context" menuProps={{
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
                    { key: 'delete', text: 'Delete', onClick: this.state.onDelete }
                ]
            }} />
    </div>
    );

    render() {
        let type = this.props.type;
        if (type === "directory") 
        {
            return (
                this.htmlForDirectory()
            );
        } 
        else if (type === "file") {
            return (
                this.htmlForFile()
            );
        }
    }
}
