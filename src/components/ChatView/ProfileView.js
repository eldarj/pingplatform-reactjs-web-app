import React, { Component } from 'react'
import DateUtils from '../../helpers/DateUtils'
import { connect } from 'react-redux'

class ProfileView extends Component {

    constructor(props) {
        super(props);

        console.log(props.account);
        props.account.dateRegistered = DateUtils.formatISODate(props.account.dateRegistered);
        this.state = {
            accountModel: props.account
        };
    }

    renderAccountHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div className="profile-data d-flex flex-column">
                <span className="kbd h5 m-1">{ account.firstname + " " + account.lastname }</span>
                <div className="d-flex">
                    <div className="m-1 small child-el-blocks kbd flex-grow-1">
                        <strong>Phone number</strong>
                        <strong>Email</strong>
                        <strong>Date joined</strong>
                    </div>
                    <div className="m-1 small child-el-blocks kbd flex-grow-1">
                        <span>{ account.phoneNumber }</span>
                        <span>{ account.email }</span>
                        <span>{ account.dateRegistered }</span>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="my-3">
                <div className="container">
                    <h1>Profile</h1>
                    <hr />
                    <div className="row">
                        <div className="col-sm-6">
                            {this.renderAccountHtml(this.state.accountModel)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(ProfileView)