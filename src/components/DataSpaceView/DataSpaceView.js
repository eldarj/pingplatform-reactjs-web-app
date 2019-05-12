import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as signalr from '@aspnet/signalr'
import axios from 'axios'

// Child components
import NotificationsPane from './partials/NotificationsPane/NotificationsPane'
import DataSpaceMainContent from './partials/DataSpaceMainContent/DataSpaceMainContent'
import DataSpaceSearch from './partials/DataSpaceSearch/DataSpaceSearch'
import SidebarNav from './partials/SidebarNav/SidebarNav'

class DataSpaceView extends Component {
  hubConnection = null;

  constructor(props) {
    super(props);
    this.state = {
      accountVM: null,
      showNotificationsPanel: false
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
      console.log("Request success: ");
      console.log(receivedMessage);
    });

    this.hubConnection.on(`UploadFileFail${window.randomGen}`, (receivedMessage) => {
      console.log("Request fail: ");
      console.log(receivedMessage);
    });
  }


  signalRHubOnConnected = () => {
    this.hubConnection
      .invoke("RequestFilesMetaData", window.randomGen, this.state.accountVM.phoneNumber)
      .catch(err => {
          console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
          console.error(err);
      });

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
  getItems = () => {
    return [
      {
        key: 'newItem',
        name: 'New',
        cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
        iconProps: {
          iconName: 'Add'
        },
        ariaLabel: 'New',
        subMenuProps: {
          items: [
            {
              key: 'emailMessage',
              name: 'Email message',
              iconProps: {
                iconName: 'Mail'
              }
            },
            {
              key: 'calendarEvent',
              name: 'Calendar event',
              iconProps: {
                iconName: 'Calendar'
              }
            }
          ]
        }
      },
      {
        key: 'upload',
        name: 'Upload',
        iconProps: {
          iconName: 'Upload'
        },
        onClick: () => this.refs.fileUploadInput.click()
      },
      {
        key: 'share',
        name: 'Share',
        iconProps: {
          iconName: 'Share'
        },
        href: 'https://dev.office.com/fabric'
      },
      {
        key: 'download',
        name: 'Download',
        iconProps: {
          iconName: 'Download'
        },
        onClick: () => console.log('Download')
      }
    ];
  };

  getOverlflowItems = () => {
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

  getFarItems = () => {
    return [
      {
        key: 'sort',
        name: 'Sort',
        iconProps: {
          iconName: 'SortLines'
        },
        onClick: () => console.log('Sort')
      },
      {
        key: 'tile',
        name: 'Grid view',
        iconProps: {
          iconName: 'Tiles'
        },
        iconOnly: true,
        onClick: () => console.log('Tiles')
      },
      {
        key: 'info',
        name: 'Info',
        iconProps: {
          iconName: 'Info'
        },
        iconOnly: true,
        onClick: () => this._showPanel()
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
      console.log(file);
      formData.append('files[' + i + ']', file);
    }
    let endpoint = 'https://localhost:44380/api/dataspace/eldarja/files';
    console.log(endpoint);
    axios.post(endpoint,
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

    // FOR LOADING INTO A VIEW OR SMTHNG (EG. Images)
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
    //       })
    //       .catch(() => {
    //         console.log("AXIOS:Catch");
    //       });
    // }
    //reader.readAsArrayBuffer(file);
    //reader.readAsDataURL(file); // triggers on load end
  }

  _showPanel = () => {
    console.log('"YES!');
    this.setState({ showNotificationsPanel: true });
  };
  render() {
    return (
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-md-2 bg-light d-flex">
            <DataSpaceSearch />
          </div>
          <div className="col-md-10">
            {/* <CommandBar
              items={this.getItems()}
              overflowItems={this.getOverlflowItems()}
              overflowButtonProps={{ ariaLabel: 'More commands' }}
              farItems={this.getFarItems()}
            /> */}
            <input type="file" ref="fileUploadInput" onChange={this.onUploadFileSelected} multiple hidden />
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 bg-light sidebar">
            <SidebarNav />
          </div>
          <div className="col-md-10">
            <DataSpaceMainContent hubConnection={this.hubConnection} />
          </div>
        </div>
        <NotificationsPane isOpen={this.state.showNotificationsPanel} />
      </div>
    );
  }
}



const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceView)