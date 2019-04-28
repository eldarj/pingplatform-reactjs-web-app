import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import * as signalr from '@aspnet/signalr';
import './LoginView.scss';

export class LoginView extends Component {
    hubConnection = null;

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            createSession: false,
            redirect: false,
            redirectUrl: 'register',
            loading: false
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
            window.setTimeout(() => {
                this.setState({ redirect: true, redirectUrl: 'profile' });
            }, 1000);
        });

        this.hubConnection.on('AuthenticationFailed', (receivedMessage) => {
            console.warn("message: " + receivedMessage);
            window.setTimeout(() => {
                this.setState({ redirect: true, redirectUrl: 'register' });
            }, 1000);
        });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: `/${this.state.redirectUrl}`,
                state: { msg: 'erol' } // for future ref
            }}/>
        }
    }

    doLogin = () => {
        this.setState({
            loading: true
        });

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

        // if we don't receive a 'callback' on our hub-client, we should handle it here
        window.setTimeout(() => {
            this.setState({ 
                redirect: true, 
                redirectUrl: 'error' });
          }, 5000);
    }

    handlePhoneNumberChange = (e) => {
        this.setState({phoneNumber: e.target.value});
    }

    handleCreateSessionChange = (e) => {
        this.setState({createSession: e.target.checked});
    }

    render() {
        let loading = this.state.loading;
        let submit;
        if (loading) {
            submit = <button className="btn btn-light w-50 rounded-0 pointer-events-none">
                <i className="fas fa-circle-notch rotate anim-speed-slow"></i>
            </button>;
        } else {
            submit = <button onClick={this.doLogin} className="btn btn-light w-50 rounded-0">Submit</button>;
        }

        return (
            <div className="my-5">
                { this.renderRedirect() }
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-md-6">
                            <div className="minimalistic-form p-4 subtle-box-shadow disperse-shadow">
                                <h3>Get started</h3>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone number</label>
                                        <input id="phoneNumber" type="number" className="form-control"
                                            placeholder="387 62 005 152" value={this.state.phoneNumber}
                                            onChange={this.handlePhoneNumberChange} />
                                        <div className="checkbox mt-2">
                                            <input id="createSession" type="checkbox" className="styled"
                                                value={this.state.createSession}
                                                onChange={this.handleCreateSessionChange} />
                                            <label htmlFor="createSession">
                                                Stay logged in
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group sublte-box-shadow">
                                        {submit}
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