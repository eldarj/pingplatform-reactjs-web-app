import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setAccountAction } from '../../redux/actions';
import * as signalr from '@aspnet/signalr';

import './LoginView.scss';

class LoginView extends Component {
    hubConnection = null;
    reduxDispatch = null;

    constructor(props) {
        super(props);

        this.reduxDispatch = props.dispatch; // set the redux dispatch for handling redux-state

        this.state = {
            phoneNumber: '',
            callingCode: '',
            createSession: false,
            redirect: false,
            redirectUrl: 'register',
            btnLoading: false,
            callingCodesLoading: true,
            callingCountryCode: '',
            callingCodes: [],
            testaccount: null,
        };
        
        if (props.account !== null) {
            this.state.testaccount = props.account;
        }
    }

    componentDidMount = () => {
        // this.hub2 = new signalr.HubConnectionBuilder()
        //     .withUrl('https://localhost:44380/chathub', { accessTokenFactory: () => this.state.testaccount.token })
        //     .build();
        
        this.hubConnection = new signalr.HubConnectionBuilder()
            .withUrl('https://localhost:44380/authhub')
            .build();
            
        this.hubConnection
            .start()
            .then(() => { this.signalRHubOnConnected() })
            .catch(() => console.log('Error establishing connection.'));
            

        this.hubConnection.on(`AuthenticationDone${window.randomGen}`, (response) => {
            this.reduxDispatch(setAccountAction(
                response.createSession,
                response.dateRegistered,
                response.email,
                response.firstname,
                response.lastname,
                response.phoneNumber,
                response.token,
                response.avatarImageUrl,
                response.coverImageUrl,
                response.contacts));
            
            window.setTimeout(() => {
                this.setState({ redirect: true, redirectUrl: 'profile' });
            }, 1000);
        });

        this.hubConnection.on(`AuthenticationFailed${window.randomGen}`, (response) => {
            console.warn("Hub connection failed message: " + response.message);
            window.setTimeout(() => {
                this.setState({ redirect: true, redirectUrl: 'register' });
            }, 1000);
        });

        this.hubConnection.on(`ResponseCallingCodes${window.randomGen}`, (receivedMessage) => {
            this.setState({ callingCodesLoading: false, callingCodes: receivedMessage, callingCountryCode: receivedMessage[0].callingCountryCode });
        });
    }

    signalRHubOnConnected = () => {
        setTimeout(() => {
            this.hubConnection
            .invoke("RequestCallingCodes", window.randomGen)
            .catch(err => {
                    console.error(`Error on: RequestAuthentication(${window.randomGen}, requestobj)`);
                    console.error(err);
            });
        }, 1000);
    }

    doLogin = () => {
        this.setState({
            btnLoading: true
        });

        let requestObj = {
            phoneNumber: this.state.phoneNumber,
            callingCountryCode: this.state.callingCountryCode,
            createSession: this.state.createSession
        }

        console.log(requestObj);

        this.hubConnection
            .invoke("RequestAuthentication", window.randomGen, requestObj)
            .catch(err => {
                console.error(`Error on: RequestAuthentication(requestobj)`);
                console.error(err);
            });

        // if we don't receive a 'callback' on our hub-client, we should handle it here
        window.setTimeout(() => {
            this.setState({ 
                redirect: true, 
                redirectUrl: 'error' });
          }, 10000);
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: `/${this.state.redirectUrl}`,
                state: { msg: 'erol' } // for future ref
            }}/>
        }
    }

    handleCallingCodeChange = (e) => {
        this.setState({callingCountryCode: e.target.value});
    }

    handlePhoneNumberChange = (e) => {
        this.setState({phoneNumber: e.target.value});
    }

    handleCreateSessionChange = (e) => {
        this.setState({createSession: e.target.checked});
    }

    render() {
        let btnLoading = this.state.btnLoading;
        let callingCodesLoading = this.state.callingCodesLoading;

        let submitBtnHtml,
        	callingCodesSpinnerHtml;
        
        if (callingCodesLoading) {
            callingCodesSpinnerHtml = <div><i className="fas fa-circle-notch rotate anim-speed-slow"></i></div>
        } else {
            callingCodesSpinnerHtml = 
                <select className="custom-select"
                	onChange={this.handleCallingCodeChange} 
                	defaultValue={this.state.callingCodes[0].callingCountryCode}>
                    {this.state.callingCodes.map((obj, i) => {
                        return <option key={i} value={obj.callingCountryCode}>
                                {'+' + obj.callingCountryCode + " " + obj.countryName + " (" + obj.isoCode + ")"}
                            </option>
                    })}
                </select>
        }

        if (btnLoading) {
            submitBtnHtml = <button className="btn btn-light w-50 rounded-0 pointer-events-none">
                	<i className="fas fa-circle-notch rotate anim-speed-slow"></i>
            	</button>
        } else {
            submitBtnHtml = <button onClick={this.doLogin} className="btn btn-light w-50 rounded-0">Submit</button>;
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
                                        <label htmlFor="callingCode">Calling code</label>
                                        {callingCodesSpinnerHtml}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone number</label>
                                        <input id="phoneNumber" type="number" className="form-control"
                                            placeholder="387 62 005 152" value={this.state.phoneNumber}
                                            onChange={this.handlePhoneNumberChange} />
                                    </div>
                                    <div className="form-group">
                                        <div className="flatos-checkbox flatos-checkbox-sm mt-2">
                                            <input id="createSession" type="checkbox" value={this.state.createSession}
                                                onChange={this.handleCreateSessionChange} />
                                            <label htmlFor="createSession">
                                                Stay logged in
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        {submitBtnHtml}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="small">
                                    Don't have an account yet?
                                    <Link to='/register' className="ml-2">
                                        Join now
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

const mapStateToProps = state => ({ account: state.account });
export default connect(mapStateToProps)(LoginView)