import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as signalr from '@aspnet/signalr'
import axios from 'axios'

// Child components
import NotificationsPane from './partials/NotificationsPane/NotificationsPane'
import DataSpaceMainContent from './partials/DataSpaceMainContent/DataSpaceMainContent'
import DataSpaceSearch from './partials/DataSpaceSearch/DataSpaceSearch'
import SidebarNav from './partials/SidebarNav/SidebarNav'

import { CommandBar, IconButton, Spinner } from 'office-ui-fabric-react'

class DataSpaceView extends Component {
  hubConnection = null;

  constructor(props) {
    super(props);
    this.state = {
      accountVM: null,
      showNotificationsPanel: false,
      rootFiles: [],
      fileUploading: false,
      additionalCommandClasses: 'disabled'
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

    this.hubConnection.on(`UploadFileSuccess${window.randomGen}`, (receivedMessage) => {
      console.log("Upload file success: ");
      console.log(receivedMessage);

      this.state.rootFiles.unshift(receivedMessage);
      this._allItems = this.state.rootFiles;
      this.setState(prevState => (
        { 
          fileUploading: false, 
          rootFiles: [...this.state.rootFiles] 
        }
      ));

    });

    this.hubConnection.on(`UploadFileFail${window.randomGen}`, (receivedMessage) => {
      console.log("Upload file fail: ");
      console.log(receivedMessage);
    });

    this.hubConnection.on(`RequestFilesMetaDataSuccess${window.randomGen}`, (receivedMessage) => {
      console.log("Request meta data success:");
      console.log(receivedMessage);
      this._allItems = receivedMessage.rootFiles;
      this.setState({ 
        loading: false, 
        rootFiles: receivedMessage.rootFiles,
        additionalCommandClasses: ''
      });
    });

    this.hubConnection.on(`RequestFilesMetaDataFail${window.randomGen}`, (receivedMessage) => {
      console.log("Request meta data fail:");
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
    }, 1500);

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
              iconProps: { iconName: 'FabricNewFolder' }
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
        key: 'rename',
        name: 'Rename...',
        onClick: () => console.log('Rename'),
        iconProps: {
          iconName: 'Edit'
        }
      }
    ];
  };

  // TODO: File read and upload ::FileReader()
  onUploadFileSelected = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    let formData = new FormData();
    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      console.log("FILE:");
      console.log(file);
      formData.append('files[' + i + ']', file);
    }
    this.setState({ fileUploading: true });
    setTimeout(() => {
      axios.post('https://localhost:44380/api/dataspace/eldarja/files',
      formData,
      {
        onUploadProgress: (e) => {
          let percentCompleted = Math.round((e.loaded * 100) / e.total);
          console.log(percentCompleted);
        },
        headers: {
          "AppId": window.randomGen,
          "OwnerPhoneNumber": this.state.accountVM.phoneNumber,
          "OwnerFirstName": this.state.accountVM.firstname,
          "OwnerLastName": this.state.accountVM.lastname
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
    console.log('"YES!');
    this.setState({ showNotificationsPanel: true });
  };

  FarCommands = () => (
      <div className={`d-flex flex-row bg-primary-grey-light px-3 ${this.state.additionalCommandClasses}`}>
        <Spinner className="px-3" style={{visibility: this.state.fileUploading ? 'visible' : 'hidden'}} />
        <IconButton className="ms-icon-regular h-auto" iconProps={{iconName: "Info"}} />
      </div>
  );

  render() {
    return (
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-md-2 bg-light sidebar">
            <DataSpaceSearch />
            <SidebarNav />
          </div>
          <div className="col-md-10">
            <div className="d-flex flex-row">
              <CommandBar className={`flex-grow-1 ${this.state.additionalCommandClasses}`}
                items={this._getItems()}
                overflowItems={this._getOverlflowItems()}
              />
              <this.FarCommands />
            </div>
            <input type="file" ref="fileUploadInput" onChange={this.onUploadFileSelected} multiple hidden />
            <DataSpaceMainContent
              hubConnection={this.hubConnection}
              rootFiles={this.state.rootFiles} />
          </div>
        </div>
        <NotificationsPane isOpen={this.state.showNotificationsPanel} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceView)