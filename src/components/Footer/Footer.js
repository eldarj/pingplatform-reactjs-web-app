import React, { Component } from 'react';

export class Footer extends Component {
    render() {
        return (
        <footer className="container pt-5 pb-1 small">
          <div className="row pb-3">
            <div className="col-12 col-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="d-block mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
              <small className="d-block mb-3 text-muted">&copy; 2019</small>
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
                © Ping - connect in real-time, since 2019. View our Data Policy and Terms.
            </p>
          </div>
        </footer>
        );
    }
}