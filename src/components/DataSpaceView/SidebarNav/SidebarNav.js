import React, { Component } from 'react'
import { connect } from 'react-redux'

class SidebarNav extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return(
            <div className="data-space-sidebar-nav">
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
                <p className="small">Groups help you share your content with specific people.</p>
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(SidebarNav)