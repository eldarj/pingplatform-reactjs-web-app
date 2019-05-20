import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as signalr from '@aspnet/signalr'
import axios from 'axios'

// Child components
import NotificationsPane from './NotificationsPane/NotificationsPane'
import DataSpaceMainContent from './DataSpaceMainContent/DataSpaceMainContent'
import DataSpaceSearch from './DataSpaceSearch/DataSpaceSearch'
import SidebarNav from './SidebarNav/SidebarNav'

import { ActionButton, Modal, CommandBar, IconButton, Spinner } from 'office-ui-fabric-react'

class DataSpaceView extends Component {
  hubConnection = null;
  _prevDirObjects = [];
  _currentDirName = "My drive";

  constructor(props) {
    super(props);
    this.state = {
      accountVM: null,
      showNotificationsPanel: false,
      fileUploading: false,
      IsUploadModalVisible: false,
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
        rootDir: receivedMessage
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

      this.setState(prevState => (
        {
          fileUploading: false,
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

    this.hubConnection.on(`DeleteFileMetadataSuccess${window.randomGen}`, (filePath) => {
      if (!filePath.includes('/')) {
        filePath = '/' + filePath;
      }

      let filteredNodes = this.state.rootDir.nodes.filter(node => node.path + "/" + node.name !== filePath);

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

    //this.getStream();
  }

  // Get signalR streamed data
  getStream = () => {
    // this.hubConnection.stream("DelayCounter", 500)
    //   .subscribe({
    //     next: (item) => {
    //       console.log(item);
    //     },
    //     complete: () => {
    //       console.log('completed');
    //     },
    //     error: (err) => {
    //       console.log('error');
    //     },
    //   });
  }
  // Data for CommandBar
  _getItems = () => {
    return [
      {
        key: 'newItem',
        name: 'New',
        iconProps: { iconName: 'Add' },
        subMenuProps: {
          items: [
            {
              key: 'directory',
              name: 'Directory',
              iconProps: { iconName: 'FabricNewFolder' },
              onClick: this._openNewDirModal
            },
            {
              key: 'link',
              name: 'link',
              iconProps: { iconName: 'Link' }
            }
          ]
        }
      },
      {
        key: 'upload',
        name: 'Upload',
        iconProps: { iconName: 'Upload' },
        onClick: () => this.refs.fileUploadInput.click()
      },
      {
        key: 'share',
        name: 'Share',
        iconProps: { iconName: 'Share' },
        onClick: () => console.log('Share')
      },
      {
        key: 'download',
        name: 'Download',
        iconProps: { iconName: 'Download' },
        onClick: () => console.log('Download')
      }
    ];
  };

  _getOverlflowItems = () => {
    return [
      {
        key: 'move',
        name: 'Move to...',
        onClick: () => console.log('Move to'),
        iconProps: {
          iconName: 'MoveToFolder'
        }
      },
      {
        key: 'copy',
        name: 'Copy to...',
        onClick: () => console.log('Copy to'),
        iconProps: {
          iconName: 'Copy'
        }
      },
      {
        key: 'delete',
        name: 'Delete...',
        onClick: () => console.log('Delete'),
        iconProps: {
          iconName: 'Delete'
        }
      }
    ];
  };

  // TODO: CHECK FOR SAME NAME (EXISTING IMAGE WILL GET OVERRIDEN)
  // File read and upload
  onUploadFileSelected = (e) => {
    this.setState({ fileUploading: true });
    // Get the file and prepare a FormData obj
    //let reader = new FileReader();
    let formData = new FormData();

    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      this.state.rootDir.nodes = this.state.rootDir.nodes.filter(node => node.name !== file.name);
      formData.append('files[' + i + ']', file); // we accept multi-file upload
    }

    // Prepare the upload url-endpoint
    let directoryPath = this.state.rootDir.path ? this.state.rootDir.path + "/" : "";
    directoryPath += this.state.rootDir.name ? this.state.rootDir.name : "";

    let url = `https://localhost:44380/api/dataspace/eldarja/files/${directoryPath}`;
    setTimeout(() => {
      axios.post(url, formData,
        {
          headers: { // TODO: Remove this in favour to a Authentication obj wrapper (on both front end back end)
            "AppId": window.randomGen,
            "OwnerPhoneNumber": this.state.accountVM.phoneNumber,
            "OwnerFirstName": this.state.accountVM.firstname,
            "OwnerLastName": this.state.accountVM.lastname
          },
          onUploadProgress: (e) => {
            let percentCompleted = Math.round((e.loaded * 100) / e.total);
            console.log(percentCompleted);
          },
          withCredentials: false
        })
        .then((e) => {
          console.log(e);
          console.log("AXIOS:Then");
        })
        .finally((e) => {
          console.log(e);
          console.log("AXIOS:Finaly");
        })
        .catch((e) => {
          console.log(e);
          console.log("AXIOS:Catch");
        });

    }, 1500);

    // // FOR LOADING INTO A VIEW OR SMTHNG (EG. Images)
    // let fileSize;
    // reader.onloadstart = (e) => {
    //     console.log('LOADSTART');
    //     fileSize = e.total;
    //     console.log(e);
    // }
    // reader.onload = (e) => {
    // }
    // reader.onprogress = (e) => {
    //     let uploadedPercentage = (e.loaded / fileSize) * 100;
    //     console.log(`PROGRESS - ${uploadedPercentage}%`);
    //     console.log(e);
    // }
    // reader.onerror = (e) => {
    // }
    // reader.onloadend = (e) => {
    //     console.log('LOADEND');
    //     console.log(e);
    //     console.log(file);
    //     console.log(reader.result);

    //     let formData = new FormData();
    //     formData.append('file', file);
    //     axios({
    //       method: 'post',
    //       url: 'https://localhost:44380/api/dataspace/upload2',
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //         'Filename': '1851768.txt'
    //       },
    //       data: formData
    //     }).then(() => {
    //         console.log("AXIOS:Then");
    //       })
    //       .finally(() => {
    //         console.log("AXIOS:Finaly");
    //         this.setState({ fileUploading: false });
    //       })
    //       .catch(() => {
    //         console.log("AXIOS:Catch");
    //       });
    // }
    // reader.readAsArrayBuffer(file);
    // reader.readAsDataURL(file); // triggers on load end
  }

  _showPanel = () => {
    this.setState({ showNotificationsPanel: true });
  };

  FarCommands = () => (
    <div className="d-flex flex-row">
      <Spinner className="px-3" style={{ visibility: this.state.fileUploading ? 'visible' : 'hidden' }} />
      <IconButton className="ms-icon-regular h-auto" iconProps={{ iconName: "Info" }} />
    </div>
  );

  onTraverseToDir = (dir) => {
    this._currentDirName = dir.name;
    this._prevDirObjects.push(this.state.rootDir);
    console.log(this.state.rootDir);
    this.setState({ rootDir: dir });
  }

  _traverseBack = () => {
    let previousDirectory = this._prevDirObjects.pop();
    console.log("### TRAVERSE BACK ###");
    console.log(previousDirectory);
    this._currentDirName = previousDirectory.name;
    this.setState({ rootDir: previousDirectory });
  }

  TraverseBackButton = () => {
    if (this._prevDirObjects.length > 0) {
      return (
        <ActionButton iconProps={{ iconName: "ChevronLeft" }} onClick={this._traverseBack}>Back</ActionButton>
      )
    }
    return null;
  }

  DataSpaceSubHeading = () => {
    return (
      <div className="sub-holder">
        <this.TraverseBackButton />
        <div className="ml-2">{this._currentDirName}</div>
      </div>
    );
  }

  _openNewDirModal = () => {
    this.setState({ IsUploadModalVisible: true });
  }
  _closeNewDirModal = () => {
    this.setState({ IsUploadModalVisible: false });
  };
  _createNewDirectory = () => { // TODO: Cleanup (backend-side is done) && lookinto using authentication vs eldarja in :url:
    this.setState({ IsUploadModalVisible: false, fileUploading: true });
    let newDirDto = { name: this.refs.newDirectoryInput.value };
    setTimeout(() => {
      // Create URL-endpoint: Splice to remove the first 'root' dir and join all other ones eg. /fodler1/folder1_1/...
      let directoryPath = this.state.rootDir.path ? this.state.rootDir.path + "/" : "";
      directoryPath += this.state.rootDir.name ? this.state.rootDir.name : "";

      let url = `https://localhost:44380/api/dataspace/eldarja/directories/${directoryPath}`;
      axios.post(url, newDirDto, {
        headers: {
          "AppId": window.randomGen,
          "OwnerPhoneNumber": this.state.accountVM.phoneNumber,
        },
        withCredentials: false
      })
        .then((e) => {
          console.log(e);
          console.log("AXIOS DIRECTORY:Then");
        })
        .finally((e) => {
          console.log(e);
          console.log("AXIOS DIRECTORY:Finaly");
        })
        .catch((e) => {
          console.log(e);
          console.log("AXIOS DIRECTORY:Catch");
        });

    }, 1500);
  }

  render() {
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
            <Modal
              isOpen={this.state.IsUploadModalVisible}
              className="new-dir-modal"
              isBlocking={false}>
              <div className="modal-body d-flex flex-column">
                <strong className="modal-title mb-3">New directory</strong>
                <input type="text" ref="newDirectoryInput" className="px-1 flex-grow"
                  placeholder="Enter your directory name" />
              </div>
              <div className="modal-footer pb-1 pt-0">
                <ActionButton onClick={this._createNewDirectory} text="Create" />
                <ActionButton onClick={this._closeNewDirModal} text="Close" />
              </div>
            </Modal>
            <input type="file" ref="fileUploadInput" onChange={this.onUploadFileSelected} multiple hidden />
            <this.DataSpaceSubHeading />
            <DataSpaceMainContent
              hubConnection={this.hubConnection}
              directory={this.state.rootDir}
              onTraverseToDir={this.onTraverseToDir} />
          </div>
        </div>
        <NotificationsPane isOpen={this.state.showNotificationsPanel} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceView)