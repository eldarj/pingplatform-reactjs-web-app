
import React, { Component } from 'react'
import { ContextualMenuItemType, IconButton } from 'office-ui-fabric-react'

export default class ListItemContext extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            onDelete: props.onDelete
        }
    }

    render() {
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
                                key: 'delete',
                                iconProps: { iconName: 'Delete' },
                                text: 'Delete',
                                onClick: this.state.onDelete
                            }
                        ]
                    }}
                />
            </div>
        );
    }
}
