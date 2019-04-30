import React, { Component }  from 'react';
import NavMenu from './NavMenu/NavMenu';
import { Footer } from './Footer/Footer';

export class Layout extends Component {

  constructor(props) {
    super(props);
  }
  
  render () {
    return (
    <div className="root-inner-wrap">
      <div className="bg-white position-relative mx-2 z-index-1">
        <NavMenu />
      </div>
      <div className="root-main-content d-flex flex-column">
        {this.props.children}
      </div>
      <Footer />
    </div>
    );
  }
}
