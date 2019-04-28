import React, { Component } from 'react';
import * as signalr from '@aspnet/signalr';
import { Link } from 'react-router-dom';

export class RegisterView extends Component {
    hubConnection = null;

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            email: '',
            firstname: '',
            lastname: '',
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

    handlePhoneNumberChange = (e) => {
        this.setState({phoneNumber: e.target.value});
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    handleFirstnameChange = (e) => {
        this.setState({firstname: e.target.firstname});
    }

    handleLastnameChange = (e) => {
        this.setState({lastname: e.target.lastname});
    }

    handleCreateSessionChange = (e) => {
        this.setState({createSession: e.target.checked});
    }

    doRegister = () => {
        let requestObj = {
            phoneNumber: this.state.phoneNumber,
            createSession: this.state.createSession
        }

        this.hubConnection
            .invoke("RequestAuthentication", "registerTest", requestObj)
            .catch(err => {
                console.error("Error on: RequestAuthentication('registerTest', requestobj)");
                console.error(err);
            });
    }

    render() {
        return (
            <div className="my-5">
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
                                        <button onClick={this.doRegister} type="submit" className="btnSubmit">Register</button>
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