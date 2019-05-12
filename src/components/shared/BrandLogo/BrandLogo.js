import React, { Component } from 'react'
import './BrandLogo.scss'

export default class BrandLogo extends Component {
    render() {
        let logoSrc;
        if(this.props.size === 'regular') {
            logoSrc = '/images/corporate/logo/ping-logo.jpg';
        } else if (this.props.size === 'small') {
            logoSrc = '/images/corporate/logo/ping-logo-sm.jpg';
        } else {
            logoSrc = '/images/corporate/logo/ping-logo.jpg';
        }
        return (
            <a className="logo-brand-a" href="/">
                <img className={"logo-src " + this.props.className} src={logoSrc} alt="Ping - Chat"/>
            </a>
        );
    }
}


