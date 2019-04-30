import React, { Component }  from 'react';
import { connect } from 'react-redux';
import NavMenu from './NavMenu/NavMenu';
import { FloatBox } from './shared/FloatBoxComponent/FloatBox';
import { Footer } from './Footer/Footer';

class Layout extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isLogged: false
    }

    if (props.account != null) {
        this.state.isLogged = true;
    }
  }
  
  render () {
    return (
    <div className="root-inner-wrap">
      <NavMenu />
      <div className="root-main-content d-flex flex-column">
        {this.props.children}
      </div>
      <Footer />
      <FloatBox
          visible={!this.state.isLogged}
          text="Have you tried out Ping yet? 
              Join and start chatting on the web right away, or get the app on your phone."
          link="/getstarted" linkDisplayName="Get started">
              <a href="/phone" className="btn btn-xs btn-secondary">Playstore</a>
      </FloatBox>
    </div>
    );
  }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(Layout)
