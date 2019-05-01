
import React, { Component } from 'react'
import DateUtils from '../../../helpers/DateUtils'
import { connect } from 'react-redux'

class ProfileInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {accountVM: null}

        if (props.account != null) {
            this.state.accountVM = props.account;
            this.state.accountVM.dateRegisteredHuman = DateUtils.formatISODate(props.account.dateRegistered);
        }
    }

    renderProfileHeaderHtml(account) {
        if (account == null) return (<p>no data</p>); // handle this with an error page or authorize /profile
        return (
            <div className="container d-flex flex-column profile-body-container">
                <div id="profile-preview-side" className="profile-preview-side">
                    <div className="card p-3">
                        <h2 id="name">
                            {this.state.accountVM.firstname} {this.state.accountVM.lastname}
                        </h2>
                        <div>
                            <p>@eldarjatest</p>
                            <kbd>{this.state.accountVM.email}</kbd><br/>
                            <kbd>{this.state.accountVM.phoneNumber}</kbd>
                        </div>
                        <hr/>
                        <p className="m-1">
                            This is my test description.
                        </p>
                        <p className="small m-1">
                            Date joined {this.state.accountVM.dateRegisteredHuman}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderProfileHeaderHtml(this.state.accountVM)
    }
}

const mapStateToProps = state => { return { account: state.account }};

export default connect(mapStateToProps)(ProfileInfo)

