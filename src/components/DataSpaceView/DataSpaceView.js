import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as signalr from '@aspnet/signalr'
import axios from 'axios'

// Child components
import NotificationsPane from './NotificationsPane/NotificationsPane'
import DataSpaceMainContent from './DataSpaceMainContent/DataSpaceMainContent'
import DataSpaceSearch from './DataSpaceSearch/DataSpaceSearch'
import SidebarNav from './SidebarNav/SidebarNav'

import { Modal, CommandBar, IconButton, Icon,
  Spinner, ProgressIndicator,
  PrimaryButton, DefaultButton, ActionButton } from 'office-ui-fabric-react'

class DataSpaceView extends Component {
  hubConnection = null;
  _prevDirObjects = [];
  _currentDirName = "";
  _selectedItems = [];

  filesToOverride = [];
  formData = null;
  newDirDto = null;

  dialogMessagesKey = "fileMessages";
  uploadDialogMessages = {
    fileMessages: {
      confirmTitle: "Overwrite files",
      confirmText: `File(s) with same name(s) already exist, and by confirming the upload, 
      the next ones would be overwritten: `,
      confirmQuestion: "Would you like to proceed with the upload?",
      confirmButton: "Upload and overwrite"
    },
    dirMessages: {
      confirmTitle: "Overwrite directory",
      confirmText: `Directory with same name already exist, and by confirming the upload, 
      the next ones would be overwritten: `,
      confirmQuestion: "Would you like to proceed with creating the new directory?",
      confirmButton: "Create and overwrite"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      accountVM: null,
      showNotificationsPanel: false,
      fileUploading: false,
      IsConfirmUploadModalVisible: false,
      IsUploadModalVisible: false,
      uploadProgress: 0,
      uploadSuccess: null,
      rootDir: { nodes: [] }
    }

    if (props.account != null) {
      this.state.accountVM = props.account;
    }

    this.hubConnection = new signalr.HubConnectionBuilder()
      .withUrl('https://localhost:44380/dataspacehub')
      .build();
  }

  componentDidMount() {
    this.hubConnection
      .start()
      .then(() => this.signalRHubOnConnected())
      .catch(() => console.log('Error establishing connection.'));

    this.hubConnection.on(`RequestFilesMetaDataSuccess${window.randomGen}`, (receivedMessage) => {
      console.log("Request meta data success:");
      console.log(receivedMessage);
      this.setState({
        loading: false,
        rootDir: receivedMessage,
        uploadProgress: 0
      });
    });

    this.hubConnection.on(`RequestFilesMetaDataFail${window.randomGen}`, (receivedMessage) => {
      console.log("Request meta data fail:");
      console.log(receivedMessage);
    });

    this.hubConnection.on(`SaveDirectoryMetadataFail${window.randomGen}`, (receivedMessage) => {
      console.log("On - SaveDirectoryMetadataFail:");
      console.log(receivedMessage);
    });

    this.hubConnection.on(`DeleteDirectoryMetadataSuccess${window.randomGen}`, (directoryPath) => {
      if (!directoryPath.includes('/')) {
        directoryPath = '/' + directoryPath;
      }

      let filteredNodes = this.state.rootDir.nodes.filter(node => node.path + "/" + node.name !== directoryPath);

      this.setState(prevState => (
        {
          loading: false,
          rootDir: {
            ...prevState.rootDir,
            nodes: filteredNodes
          }
        }
      ));
      if (this._prevDirObjects.length > 0) {
        this._prevDirObjects[this._prevDirObjects.length - 1].nodes
          .find(node => node.name === this.state.rootDir.name).nodes = filteredNodes;
      }
    });

    this.hubConnection.on(`DeleteDirectoryMetadataFail${window.randomGen}`, (directoryPath, reasonMsg) => {
      console.log("Delete file fail: " + directoryPath + reasonMsg);
    });

    this.hubConnection.on(`UploadFileSuccess${window.randomGen}`, (receivedMessage) => {
      console.log("Upload file success: ");
      console.log(receivedMessage);
      this.state.rootDir.nodes.unshift(receivedMessage);
      this.setState(prevState => (
        {
          fileUploading: false,
          uploadSuccess: true,
          rootDir: {
            ...this.state.rootDir,
            nodes: [...this.state.rootDir.nodes]
          }
        }
      ));

      if (this._prevDirObjects.length > 0) {
        this._prevDirObjects[this._prevDirObjects.length - 1].nodes
          .find(node => node.name === this.state.rootDir.name).nodes = this.state.rootDir.nodes;
      }
    });

    this.hubConnection.on(`SaveDirectoryMetadataSuccess${window.randomGen}`, (directoryDto) => {
      console.log("On - SaveDirectoryMetadataSuccess:");
      console.log(directoryDto);
      this.state.rootDir.nodes.unshift(directoryDto);
      console.log(this.state.rootDir);

      this.setState(prevState => ({
        fileUploading: false,
        uploadSuccess: true,
        rootDir: {
          ...this.state.rootDir,
          nodes: [...this.state.rootDir.nodes]
        }
      }));
      
      if (this._prevDirObjects.length > 0) {
        this._prevDirObjects[this._prevDirObjects.length - 1].nodes
          .find(node => node.name === this.state.rootDir.name).nodes = this.state.rootDir.nodes;
      }
    });

    this.hubConnection.on(`DeleteFileMetadataSuccess${window.randomGen}`, (filePath) => {
      if (!filePath.includes('/')) {
        filePath = '/' + filePath;
      }

      let filteredNodes = this.state.rootDir.nodes.filter(node => node.path + "/" + node.name !== filePath);

      this.setState(prevState => ({
        loading: false,
        rootDir: {
          ...prevState.rootDir,
          nodes: filteredNodes
        }
      }));

      if (this._prevDirObjects.length > 0) {
        this._prevDirObjects[this._prevDirObjects.length - 1].nodes
          .find(node => node.name === this.state.rootDir.name).nodes = filteredNodes;
      }
    });

    this.hubConnection.on(`DeleteFileMetadataFail${window.randomGen}`, (filename, reasonMsg) => {
      console.log("Delete file fail: " + filename + reasonMsg);
    });

    this.hubConnection.on(`UploadFileFail${window.randomGen}`, (receivedMessage) => {
      console.log("Upload file fail: ");
      console.log(receivedMessage);
    });
  }

  signalRHubOnConnected = () => {
    setTimeout(() => {
      this.hubConnection
        .invoke("RequestFilesMetaData", window.randomGen, this.state.accountVM.phoneNumber)
        .catch(err => {
          console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
          console.error(err);
        });
    }, 150); // TODO: REMOVE OR ADJUST THIS 
  }

  // Data for CommandBar
  _getItems = () => [
    { key: 'newItem', name: 'New', iconProps: { iconName: 'Add' }, subMenuProps: {
      items: [
        { key: 'directory', name: 'Directory', iconProps: { iconName: 'FabricNewFolder' }, onClick: this._openNewDirModal },
        { key: 'link', name: 'link', iconProps: { iconName: 'Link' } }
      ]}
    },
    { key: 'upload', name: 'Upload', iconProps: { iconName: 'Upload' }, onClick: () => this.refs.fileUploadInput.click() },
    { key: 'share', name: 'Share', iconProps: { iconName: 'Share' }, onClick: () => console.log('Share') },
    { key: 'download', name: 'Download', iconProps: { iconName: 'Download' }, onClick: () => console.log('Download') }
  ];

  _getOverlflowItems = () => [
    { key: 'move', name: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
    { key: 'copy', name: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
    { key: 'delete', name: 'Delete...', onClick: this._deleteSelected, iconProps: { iconName: 'Delete' } }
  ];

  onUploadFileSelected = (e) => {
    this.setState({ fileUploading: true });
    // Move this somewhere else - we're creating a FormData obj and looping in a for, 
    //  --- even if we don't know yet that we'll do an upload (cuz of possible overrideCheck Dialog)
    this.formData = new FormData();

    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      this.formData.append('files[' + i + ']', file); // we accept multi-file upload
    }

    let existingFiles = this.state.rootDir.nodes.map(node => node.name);
    let filesToUpload = Array.from(e.target.files).map(f => f.name);
    this.filesToOverride = filesToUpload.filter(f => existingFiles.includes(f));

    if (this.filesToOverride.length > 0) {
      this._showDialog("fileMessages");
    } else {
      this.doUpload();
    }
  }

  doUpload = () => {
    // Removes existing files from the current dir, that will be overwritten
    this.state.rootDir.nodes = this.state.rootDir.nodes.filter(node => !this.filesToOverride.includes(node.name));

    // Prepare the upload url-endpoint
    let directoryPath = this.state.rootDir.path ? this.state.rootDir.path + "/" : "";
    directoryPath += this.state.rootDir.name ? this.state.rootDir.name : "";

    let url = `https://localhost:44380/api/dataspace/eldarja/files/${directoryPath}`;
    axios.post(url, this.formData,
      {
        headers: { // TODO: Remove this in favour to a Authentication obj wrapper (on both front end back end)
          "AppId": window.randomGen,
          "OwnerPhoneNumber": this.state.accountVM.phoneNumber,
          "OwnerFirstName": this.state.accountVM.firstname,
          "OwnerLastName": this.state.accountVM.lastname
        },
        onUploadProgress: (e) => {
            this.setState({
              uploadProgress: parseFloat((e.loaded / e.total)*100).toFixed(2)
            })
        },
        withCredentials: false
      }).catch(e => {
        this.setState({ fileUploading: false, uploadSuccess: false });
      });
  }

  _showPanel = () => {
    this.setState({ showNotificationsPanel: true });
  };

  FarCommands = () => (
    <div className="font-size-regular d-flex flex-row align-items-center">
      <span className={ "mr-2 " + (this.state.fileUploading ? "" : "d-none") }>{this.state.uploadProgress} %</span>
      <Icon iconName="SkypeCircleCheck" 
        className={ "ms-icon-regular mr-3 color-success " + (!this.state.fileUploading && this.state.uploadSuccess === true ? "" : "d-none") } />
      <Icon iconName="SkypeCircleCheck" 
        className={ "ms-icon-regular mr-3 color-error " + (!this.state.fileUploading && this.state.uploadSuccess === false ? "" : "d-none") } />
      <Spinner className={"px-3 " + (this.state.fileUploading ? "" : "d-none") } />
      <IconButton className="ms-icon-regular" iconProps={{ iconName: "Info" }} />
    </div>
  );

  onTraverseToDir = (dir) => {
    this._currentDirName = dir.name;
    this._prevDirObjects.push(this.state.rootDir);

    this.setState({ rootDir: dir });
  }

  _traverseBack = () => {
    let previousDirectory = this._prevDirObjects.pop();
    this._currentDirName = previousDirectory.name;

    this.setState({ rootDir: previousDirectory });
  }

  TraverseBackButton = () => {
    if (this._prevDirObjects.length > 0) {
      return (
        <ActionButton iconProps={{ iconName: "ChevronLeft" }}
          className="traverse-back-btn"
          onClick={this._traverseBack}>Back</ActionButton>
      )
    }
    return null;
  }

  DataSpaceSubHeading = () => {
    return (
      <div className="sub-holder">
        <div className="title ml-2">{this._prevDirObjects.length <= 0 ? "My drive" : this._currentDirName}</div>
        <this.TraverseBackButton />
      </div>
    );
  }

  _openNewDirModal = () => {
    this.setState({ IsUploadModalVisible: true });
  }
  
  _closeNewDirModal = () => {
    this.setState({ IsUploadModalVisible: false });
  };

  // TODO: Cleanup (backend-side is done) && lookinto using authentication vs eldarja in :url:
  _createNewDirectory = () => {
    this.setState({ IsUploadModalVisible: false, fileUploading: true });
    this.newDirDto = { name: this.refs.newDirectoryInput.value };

    let existingDirs = this.state.rootDir.nodes.reduce( (filtered, node) => { 
      if(node.nodeType === "Directory") {
        filtered.push(node.name);
      }
      return filtered;
    }, []);
    
    this.filesToOverride = existingDirs.filter(f => f === this.newDirDto.name);

    if (this.filesToOverride.length > 0) {
      this._showDialog("dirMessages");
    } else {
      this.doCreateDir();
    }
  }

  doCreateDir = () => {
    this.state.rootDir.nodes = this.state.rootDir.nodes.filter(node => this.newDirDto.name !== node.name);

    // Create URL-endpoint: Splice to remove the first 'root' dir and join all other ones eg. /fodler1/folder1_1/...
    let directoryPath = this.state.rootDir.path ? this.state.rootDir.path + "/" : "";
    directoryPath += this.state.rootDir.name ? this.state.rootDir.name : "";

    let url = `https://localhost:44380/api/dataspace/eldarja/directories/${directoryPath}`;
    setTimeout(() => {
      // Fire and forget? - No... either switch to SignalR - or keep at API for uploading dirs with content?
      axios.post(url, this.newDirDto, {
        headers: {
          "AppId": window.randomGen,
          "OwnerPhoneNumber": this.state.accountVM.phoneNumber,
        },
        withCredentials: false
      });
    }, 1500);
  }

  _showDialog = (messagesFor) => {
    this.dialogMessagesKey = messagesFor;
    this.setState({ IsConfirmUploadModalVisible: true });
  };

  _closeDialog = () => {
    this.setState({ IsConfirmUploadModalVisible: false });
  };

  htmlConfirmDelete = () => {
    let overrideList = (
      <ul>
        {
        this.filesToOverride.map((file, i) => {
          return <li key={i}>{file}</li>
        })
      }
      </ul>
    );
    return (
      <Modal isOpen={this.state.IsConfirmUploadModalVisible} onDismiss={this._closeDialog}
        isDarkOverlay={false}
        isBlocking={true}>
        <div className="dialog-modal-body">
          <div className="dialog-header">
            <p className="dialog-title">{this.uploadDialogMessages[this.dialogMessagesKey].confirmTitle}</p>
          </div>
          <div className="dialog-inner">
            <div className="dialog-content">
              <p className="dialog-sub-text pb-2 border-bottom">
                {this.uploadDialogMessages[this.dialogMessagesKey].confirmText}
              </p>
              <div className="dialog-list border-bottom">
                {overrideList}
              </div>
              <p className="dialog-sub-text mt-4">
                {this.uploadDialogMessages[this.dialogMessagesKey].confirmQuestion}
              </p>
            </div>
            <div className="dialog-actions text-right">
              <PrimaryButton onClick={() => {
                  this._closeDialog(); 
                  if (this.dialogMessagesKey === "fileMessages") {
                    this.doUpload();
                  } else {
                    this.doCreateDir();
                  }
                }}
                text={this.uploadDialogMessages[this.dialogMessagesKey].confirmButton} />
              <DefaultButton onClick={this._closeDialog}
                text="Cancel" />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  htmlNewDirectory = React.forwardRef((props, ref) => (
    <Modal
      isOpen={this.state.IsUploadModalVisible}
      className="new-dir-modal"
      isBlocking={false}>
      <div className="modal-body d-flex flex-column">
        <strong className="modal-title mb-3">New directory</strong>
        <input type="text" ref={ref} className="px-1 flex-grow"
          placeholder="Enter your directory name" />
      </div>
      <div className="modal-footer pb-1 pt-0">
        <ActionButton onClick={this._createNewDirectory} text="Create" />
        <ActionButton onClick={this._closeNewDirModal} text="Close" />
      </div>
    </Modal>
  ));

  _deleteSelected = () => {
    alert('delete seleceted');
  }

  onCheckedItems = (items, isChecked) => {
    if (items.length > 0) 
    {
      if (isChecked) 
      {
        this._selectedItems.push(...items.filter(i => !this._selectedItems.includes(i)));
      } 
      else 
      {
        this._selectedItems = this._selectedItems.filter(i => !items.includes(i))
      }
    }
    console.log(this._selectedItems);
  }

  render() {
    //// TODO: Check performance?
    // let mainContent;
    // if (this.state.rootDir.nodes.length > 0) {
    //   mainContent = <DataSpaceMainContent />
    // } else {
    //   mainContent = <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
    //       <span className="label-primary">There's nothing here, please upload some resources.</span>
    //     </div>
    // }
    return (
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-md-2 bg-light sidebar">
            <DataSpaceSearch />
            <SidebarNav />
          </div>
          <div className="col-md-10 d-flex flex-column">
            <div className="commandbar-holder d-flex bg-primary-grey-light">
              <CommandBar className="left-commands flex-grow-1"
                items={this._getItems()}
                overflowItems={this._getOverlflowItems()} />
              <div className="right-commands px-3 d-flex">
                <this.FarCommands />
              </div>
            </div>
            <this.htmlNewDirectory ref="newDirectoryInput" />
            <input type="file" ref="fileUploadInput" onChange={this.onUploadFileSelected} multiple hidden />
            <ProgressIndicator className={ "upload-progress-bar " + (this.state.fileUploading ? "visible" : "invisible") }/>
            <this.DataSpaceSubHeading />
            <DataSpaceMainContent
              hubConnection={this.hubConnection}
              directory={this.state.rootDir}
              onCheckedAllItems={this.onCheckedAllItems}
              onCheckedItems={this.onCheckedItems}
              onTraverseToDir={this.onTraverseToDir} 
            />
          </div>
        </div>
        <NotificationsPane isOpen={this.state.showNotificationsPanel} />
        <this.htmlConfirmDelete />
      </div>
    );
  }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceView)