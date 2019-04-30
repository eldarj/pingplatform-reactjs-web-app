import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HeroSlider } from '../HeroSlider/HeroSlider';

class IndexView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLogged: false
        }
    
        if (props.account != null) {
            this.state.isLogged = true;
        }
    }

    render() {
        return (
            <div className="text-left">
                <HeroSlider />
                <div>
                    <div className="container">
                        <div className="row py-4">
                            <div className="col-sm">
                                <h4 className="display-4 text-center">More than a chat</h4>
                                <p className="lead text-center">
                                    With a variety of calling and messaging features, you have endless options when it comes to expressing yourself.
                        </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary-light">
                    <div className="container">
                        <div className="row py-4">
                            <div className="col-sm-12">
                                <h4 className="display-4 text-center">Security</h4>
                                <p className="lead text-center mb-5">
                                    With Ping you need zero setup time for fully securing your account, and more importantly all your data.
                                </p>
                            </div>
                            <div className="col-sm">
                                <h5>Encryption</h5>
                                <p>
                                    Ping supports true end-to-end data encryption which only you can have access to.
                                </p>
                                <p>
                                    By registering on the platform
                                    you're given a key, that's required to access any data - and you're the only one who has that key.
                                </p>
                                <p>
                                    Nothing is saved on the platform, the data <i>lives</i> only as long as you keep it.
                                </p>
                            </div>
                            <div className="col-sm">
                                <h5>Data access</h5>
                                <p>
                                    Once you setup your account and start using Ping, you're the only one with access to your
                                    profile info, data space and messaging history - you choose with whom you want to share your data.
                                </p>
                                <p>
                                    Never was it easier to connect with people and have absolute control over your presence -
                                    share only what you want and with who you want.
                                </p>
                            </div>
                            <div className="col-sm">
                                <h5>Peer-to-peer</h5>
                                <p>
                                    Ping is a peer-to-peer chat platform that connects you with other poeple over peer-to-peer routes.
                                </p>
                                <p>
                                    Your data will travel directly from you to your connection,
                                    and won't and can't be tracked by Ping or anyone else, by design.
                                </p>
                                <p>
                                    Ping helps you connect, you control the connection.
                                </p>
                            </div>
                            <div className="col-sm-12">
                                <p className="lead text-center pt-4">
                                    You're the one with the total control over your data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container">
                        <div className="row py-4">
                            <div className="col-sm">
                                <h4 className="display-4 text-center">Your private data space</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary-light">
                    <div className="container">
                        <div className="row py-4">
                            <div className="col-sm">
                                <h4 className="display-4 text-center">Don't have Ping yet?</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(IndexView)