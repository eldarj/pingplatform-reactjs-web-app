import React, { Component } from 'react';
import * as signalr from '@aspnet/signalr';
import './LoginView.scss';

export class LoginView extends Component {
    hubConnection = null;

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            createSession: false
        };
    }

    componentDidMount = () => {
        this.hubConnection = new signalr.HubConnectionBuilder()
            .withUrl('https://localhost:44380/accountshub')
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started.'))
            .catch(() => console.log('Error establishing connection.'));

        this.hubConnection.on('AuthenticationDone', (nick, receivedMessage) => {
            console.log("nick: " + nick);
            console.log("message: ");
            console.log(receivedMessage);
        });

        this.hubConnection.on('AuthenticationFailed', (receivedMessage) => {
            console.log("message: " + receivedMessage);
        });
    }

    doLogin = () => {
        let requestObj = {
            phoneNumber: this.state.phoneNumber,
            createSession: this.state.createSession
        }

        this.hubConnection
            .invoke("RequestAuthentication", "loginTest", requestObj)
            .catch(err => {
                console.error("Error on: RequestAuthentication('loginTest', requestobj)");
                console.error(err);
            });
    }

    handlePhoneNumberChange = (e) => {
        this.setState({phoneNumber: e.target.value});
    }

    handleCreateSessionChange = (e) => {
        this.setState({createSession: e.target.checked});
    }

    render() {
        return (
            <div className="my-5">
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-md-6">
                            <div className="minimalistic-form p-4 subtle-box-shadow disperse-shadow">
                                <h3>Get started</h3>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Unesite broj telefona</label>
                                        <input id="phoneNumber" type="number" className="form-control"
                                            placeholder="387 62 005 152" value={this.state.phoneNumber}
                                            onChange={this.handlePhoneNumberChange} />
                                        <div className="checkbox mt-2">
                                            <input id="createSession" type="checkbox" className="styled"
                                                value={this.state.createSession}
                                                onChange={this.handleCreateSessionChange} />
                                            <label htmlFor="createSession">
                                                Ostani prijavljen
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group sublte-box-shadow">
                                        <button onClick={this.doLogin} type="submit" className="btnSubmit">Submit</button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="small">
                                    Don't have an account yet?
                                    <a href="/register" className="ml-2">Join now</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}