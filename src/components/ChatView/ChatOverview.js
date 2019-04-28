import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChatOverview extends Component {
    
    constructor(props) {
        super(props);
        console.log(props.account);
    }

    render() {
        return (
            <div className="my-5 py-5">
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-sm-12 text-center">
                            <h1>
                               Chat
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account
});

export default connect(mapStateToProps)(ChatOverview)