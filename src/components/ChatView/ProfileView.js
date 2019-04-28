import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileView extends Component {

    constructor(props) {
        super(props);

        console.log(props.account);
        this.state = {
            accountModel: props.account
        };
    }

    renderAccountHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <h5>{ account.firstname + " " + account.lastname }</h5>
        );
    }

    render() {
        return (
            <div className="my-2">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>Profile</h1>
                            <div className="profile-data">
                                {this.renderAccountHtml(this.state.accountModel)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileView)