import React, { Component } from 'react';

export class HeroSlider extends Component {
    constructor(props){
        super(props);
        
        this.state = {
          activeClass: ''
        };
    }

    componentDidMount(){
        window.addEventListener('scroll', (event) => {
            this.setState({
                activeClass: 'doRotate'
            })
        });
    }
    
    render() {
    let rotateClass = this.state.activeClass;
        return (
        <div className="container">
            <div className="hero-slider position-relative py-md-5 mb-md-3">
                <div className="col-md-5 mr-auto px-0">
                <h2 className="font-weight-bold">Connect with everyone, from anywhere</h2>
                <p className="lead">
                    Text, call and chat with all your friends and contacts all over the world. 
                    Fast, secure and encrypted on the web and your phone, right now.
                </p>
                <a className="btn btn-outline-danger" href="/">Get started</a>
                </div>
                <div className={"product-device product-device-2 box-shadow d-none d-md-block rotate-left " + rotateClass}></div>
                <div className={"product-device box-shadow d-none d-md-block rotate-right " + rotateClass}></div>
            </div>
        </div>
        );
    }
}