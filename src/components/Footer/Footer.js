import React, { Component } from 'react';
import BrandLogo from '../shared/BrandLogo/BrandLogo'

export class Footer extends Component {
    render() {
        return (
        <footer className="container pt-5 pb-1 small">
          <div className="row pb-3">
            <div className="col-12 col-md d-flex">
              <BrandLogo size="small" className="x-small mr-2" />
              <small className="text-muted">
                <i className="far fa-copyright mr-1"></i>
                <i className="far fa-registered mr-1"></i>
                <i className="fas fa-trademark mr-1"></i><br/>
                2019
              </small>
            </div>
            <div className="col-6 col-md">
              <h5>Features</h5>
              <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="/">Call and video-chat</a></li>
                <li><a className="text-muted" href="/">Keep your data secure</a></li>
                <li><a className="text-muted" href="/">Store and share</a></li>
                <li><a className="text-muted" href="/">Developers</a></li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>Get started</h5>
              <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="/">How to</a></li>
                <li><a className="text-muted" href="/">On the web</a></li>
                <li><a className="text-muted" href="/">On Android</a></li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>Resources</h5>
              <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="/">Business</a></li>
                <li><a className="text-muted" href="/">Open-source</a></li>
                <li><a className="text-muted" href="/">Referrals</a></li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>About</h5>
              <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="/">Team</a></li>
                <li><a className="text-muted" href="/">Locations</a></li>
                <li><a className="text-muted" href="/">Privacy</a></li>
                <li><a className="text-muted" href="/">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-sub">
            <p>
              <BrandLogo className="small mr-2" />
              <small className="text-muted mr-1">
                <i className="far fa-copyright mr-1"></i>
                <i className="far fa-registered mr-1"></i>
                <i className="fas fa-trademark mr-1"></i>
                2019
              </small>
              - Connect in real-time, since 2019. View our Data Policy and Terms.
            </p>
          </div>
        </footer>
        );
    }
}