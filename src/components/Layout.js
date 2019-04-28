import React, { Component }  from 'react';
import { NavMenu } from './NavMenu/NavMenu';
import { Footer } from './Footer/Footer';

export class Layout extends Component {
  static displayName = Layout.name;
  
  render () {
    return (
    <div className="root-inner-wrap">
      <div className="bg-white position-relative z-index-1">
        <NavMenu />
      </div>
      <div className="root-main-content">
        {this.props.children}
      </div>
      <Footer />
    </div>
    );
  }
}
