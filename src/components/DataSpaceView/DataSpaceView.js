import React, { Component } from 'react'
import { connect } from 'react-redux'

class DataSpaceView extends Component {

    constructor(props) {
        super(props);

        this.state = { accountVM: null }

        if (props.account != null) {
            this.state.accountVM = props.account;
        }
    }

    onUploadFileSelected = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            console.log(file);
            console.log(reader.result);
        }

        reader.readAsDataURL(file); // triggers on load end
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 bg-light d-flex">
                        <div className="search d-flex align-items-center">
                            <span>Serach</span>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="d-flex bg-white">
                            <nav className="nav nav-underline">
                                <a className="nav-link" href="/">New</a>
                                <a className="nav-link" href="/">Upload</a>
                                <a className="nav-link" href="/">Share</a>
                            </nav>
                            <nav className="nav nav-underline ml-auto">
                                <a className="nav-link" href="/">Options</a>
                                <a className="nav-link" href="/">Notes</a>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 bg-light sidebar">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Files</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Recent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Starred</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Drives</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Shared</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Browse</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Backups</a>
                            </li>
                        </ul>
                        <div className="sidebar-heading px-3 mt-4 mb-1 text-muted">
                            <h6>Storage</h6>
                            5GB out of 10GB
                        </div>
                        <div className="sidebar-heading px-3 mt-4 mb-1 text-muted">
                            <h6>Groups</h6>
                            <p class="small">Groups help you share your content with specific people.</p>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <input type="file" onChange={this.onUploadFileSelected} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceView)