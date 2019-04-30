
import React, { Component } from 'react'
import DateUtils from '../../../helpers/DateUtils'
import { connect } from 'react-redux'

class ProfileInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {accountModel: null}

        if (props.account != null) {
            props.account.dateRegistered = DateUtils.formatISODate(props.account.dateRegistered);
            this.state.accountModel = props.account;
        }
    }

    renderProfileHeaderHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div className="container d-flex flex-column profile-body-container">
                <div id="profile-preview-side" className="profile-preview-side">
                    <div className="card p-3">
                        <h2 id="name">
                            {this.state.accountModel.firstname} {this.state.accountModel.lastname}
                        </h2>
                        <div>
                            <p>@eldarjatest</p>
                            <kbd>{this.state.accountModel.email}</kbd><br/>
                            <kbd>{this.state.accountModel.phoneNumber}</kbd>
                        </div>
                        <hr/>
                        <p className="m-1">
                            This is my test description.
                        </p>
                        <p className="small m-1">
                            Date joined {this.state.accountModel.dateRegistered}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderProfileHeaderHtml(this.state.accountModel)
    }
}

const mapStateToProps = state => { return { account: state.account }};

export default connect(mapStateToProps)(ProfileInfo)

