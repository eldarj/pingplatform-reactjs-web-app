import * as signalr from '@aspnet/signalr'

// let locked = true;
// let ConstHubConnection = new signalr.HubConnectionBuilder()
//         .withUrl('https://localhost:44380/dataspacehub')
//         .build();

//     ConstHubConnection
//     .start()
//     .then(() => {
//         locked = false;
//         console.log('Connection established successfully.');
//     })
//     .catch(() => {
//         locked = false;
//         console.log('Error establishing connection.');
//     });

class DataSpaceSignalRClient {
    static RequestFilesMetaData(appId, accountPhoneNumber) { // can't call this if connection is not set up...
        console.log("STATIC_METHOD");
        return "FUCKOFF";
    }
    static RequestPromise = () => new Promise((resolve, reject) => {
        console.log("PROMISE_METHOD");
        let pox = 1;
        while(pox < 1150) {
            pox++;
            console.log("POX");
        }
        resolve('FUCKOFF');
    });
}

export { DataSpaceSignalRClient };