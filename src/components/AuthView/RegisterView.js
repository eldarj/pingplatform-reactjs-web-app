import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setAccountAction } from '../../redux/actions';
import * as signalr from '@aspnet/signalr';

import './LoginView.scss';

class RegisterView extends Component {
    hubConnection = null;
    reduxDispatch = null;

    constructor(props) {
        super(props);

        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            phoneNumber: '',
            email: '',
            firstname: '',
            lastname: '',
            createSession: false,
            redirect: false,
            redirectUrl: '',
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

        this.hubConnection.on(`RegistrationDone${window.randomGen}`, (receivedMessage) => {
            console.log("message: ");
            console.log(receivedMessage);

            this.reduxDispatch(setAccountAction(
                receivedMessage.createSession,
                receivedMessage.dateRegistered,
                receivedMessage.email,
                receivedMessage.firstname,
                receivedMessage.lastname,
                receivedMessage.phoneNumber,
                receivedMessage.token));

            window.setTimeout(() => {
                this.setState({ redirect: true, redirectUrl: 'profile' });
            }, 1000);
        });

        this.hubConnection.on(`RegistrationFailed${window.randomGen}`, (receivedMessage) => {
            window.setTimeout(() => {
                this.setState({ loading: false });
            }, 1000);
        });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={ "/" + this.state.redirectUrl } />
        }
    }

    doRegister = () => {
        this.setState({
            loading: true
        });

        let requestObj = {
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            createSession: this.state.createSession
        }

        this.hubConnection
            .invoke("RequestRegistration", window.randomGen, requestObj)
            .catch(err => {
                console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
                console.log(requestObj);
                console.error(err);
            });

        // if we don't receive a 'callback' on our hub-client, we should handle it here
        window.setTimeout(() => {
            this.setState({
                redirect: true,
                redirectUrl: 'error'
            });
        }, 10000);
    }

    handlePhoneNumberChange = (e) => {
        this.setState({ phoneNumber: e.target.value });
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handleFirstnameChange = (e) => {
        this.setState({ firstname: e.target.value });
    }

    handleLastnameChange = (e) => {
        this.setState({ lastname: e.target.value });
    }

    handleCreateSessionChange = (e) => {
        this.setState({ createSession: e.target.checked });
    }

    render() {
        let loading = this.state.loading;
        let submit;

        if (loading) {
            submit = <button className="btn btn-light w-50 rounded-0 pointer-events-none">
                <i className="fas fa-circle-notch rotate anim-speed-slow"></i>
            </button>;
        } else {
            submit = <button onClick={this.doRegister} className="btn btn-light w-50 rounded-0">Register</button>;
        }

        return (
            <div className="my-5">
                {this.renderRedirect()}
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-md-6">
                            <p className="h5 mb-3">Don't have an account yet?</p>
                            <div className="minimalistic-form p-4 subtle-box-shadow disperse-shadow">
                                <h3>Register</h3>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone number</label>
                                        <input id="phoneNumber" type="number" className="form-control"
                                            placeholder="387 62 005 152" value={this.state.phoneNumber}
                                            onChange={this.handlePhoneNumberChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="text" className="form-control"
                                            placeholder="Your email adress" value={this.state.email}
                                            onChange={this.handleEmailChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="firstname">Firstname</label>
                                        <input id="firstname" type="text" className="form-control"
                                            placeholder="Firstname" value={this.state.firstname}
                                            onChange={this.handleFirstnameChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastname">Lastname</label>
                                        <input id="lastname" type="text" className="form-control"
                                            placeholder="Lastname" value={this.state.lastname}
                                            onChange={this.handleLastnameChange} />
                                    </div>
                                    <div className="form-group">
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
                                    Already have an account?
                                    <Link to='/login' className="ml-2">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(RegisterView)