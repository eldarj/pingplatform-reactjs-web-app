import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './NavMenu.scss'

class NavMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedName: '',
      isLogged: false,
      navOpen: false
    }

    if (props.account != null) {
      this.state.loggedName = props.account.firstname + " " + props.account.lastname;
      this.state.isLogged = true;
    }
  }

  renderNavLinks(isLogged) {
    if (isLogged) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to='/' className="nav-link">
              Tour
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/Features' className="nav-link">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/Enterprise' className="nav-link">
              Enterprise
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/pricing' className="nav-link">
              Pricing
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/dataspace' className="nav-link d-flex">
              <i className="mr-1 far fa-save icon-size-regular"></i>
              Data Space
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/chat' className="nav-link d-flex">
              <i className="mr-1 far fa-comment-alt icon-size-regular"></i>
              Chat
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/support' className="nav-link d-flex">
              <i className="mr-1 far fa-life-ring icon-size-regular"></i>
              Support
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/profile' className="nav-link d-flex">
              <i className="mr-1 far fa-user-circle icon-size-regular"></i>
              Profile
            </Link>
          </li>
        </ul>
      );
    }
    else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to='/' className="nav-link">
              Tour
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/getstarted' className="nav-link">
              Get started
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/Features' className="nav-link">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/Enterprise' className="nav-link">
              Enterprise
            </Link>
          </li>
          <li className="nav-item">
            <Link to='/pricing' className="nav-link">
              Pricing
            </Link>
          </li>
        </ul>
      );
    }
  }

  onToggleNavCollapse = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  render() {
    return (
      <div className="bg-white position-relative box-shadow z-index-1">
        <nav className="navbar navbar-expand-lg navbar-light bg-white container">
          <a className="navbar-brand" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="d-block mx-auto"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
              <line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
              <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line>
              <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="offcanvas" onClick={this.onToggleNavCollapse} >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={"navbar-collapse offcanvas-collapse " + (this.state.navOpen ? 'open' : '')}
            id="navbarOffcanvas">
            {this.renderNavLinks(this.state.isLogged)}
          </div>
        </nav>
        <div className="nav-scroller bg-white container">
          <nav className="nav nav-underline">
            <a className="nav-link active pl-0" href="/">Dashboard</a>
            <a className="nav-link" href="/">
              Friends
              <span className="badge badge-pill bg-light align-text-bottom">27</span>
            </a>
            <a className="nav-link" href="/">Explore</a>
            <a className="nav-link" href="/">Suggestions</a>
            <a className="nav-link" href="/">Link</a>
            <a className="nav-link" href="/">Link</a>
            <a className="nav-link" href="/">Link</a>
            <a className="nav-link" href="/">Link</a>
            <a className="nav-link" href="/">Link</a>
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(NavMenu)