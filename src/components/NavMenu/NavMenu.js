import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.scss';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white container">
        <a className="position-fixed navbar-brand" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="d-block mx-auto"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
            <line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
            <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line>
            <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
          </svg>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to='/' className="nav-link">
                Tour
              </Link>
            </li>
            <li className="nav-item">
              <Link to='/login' className="nav-link">
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
              <Link to='/support' className="nav-link">
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link to='/pricing' className="nav-link">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link to='/cart' className="nav-link">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
