import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HeroSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeClass: '',
            scrollingEl: null
        };
    }

    componentDidMount() {
        // react-custom-scrollbars scrolling div
        this.state.scrollingEl = document.getElementById('scrollbars-container').children[0];
        this.state.scrollingEl.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        this.state.scrollingEl.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        // rotate elements if in viewport
        let rotatingEl = document.getElementsByClassName('product-device')[0];
        let bounding = rotatingEl.getBoundingClientRect();
        let elCenterHeight = rotatingEl.clientHeight / 2;
        let viewportHeight = document.getElementById('root').clientHeight;

        if ((bounding.top + elCenterHeight) <= viewportHeight &&
            (bounding.top + elCenterHeight) >= 0) 
        {
            this.setState({
                activeClass: 'doRotate'
            });
        } 
        else {
            this.setState({
                activeClass: ''
            });
        }
    }

    render() {
        let rotateClass = this.state.activeClass;
        return (
            <div id="hero-container" className="container">
                <div className="hero-slider py-md-5 px-4 my-md-5">
                    <div className="row">
                    <div className="col-md-7 py-md-5 px-0">
                        <h1 className="display-4 font-weight-bold">Connect with everyone, from anywhere</h1>
                        <p className="lead">
                            Text, call and chat with all your friends and contacts all over the world.
                            Fast, secure and encrypted on the web and your phone, right now.
                        </p>
                        <Link to='/login' className="btn btn-outline-danger">
                            Get started
                        </Link>
                    </div>
                    <div className="col-md-5 py-md-5 px-0 position-relative">
                        <div className={"product-device d-none d-md-block backdrop " + rotateClass}></div>
                        <div className={"product-device d-none d-md-block " + rotateClass}></div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}