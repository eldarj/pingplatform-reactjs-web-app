import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BallsDiv } from '../shared/BallsDivComponent/BallsDiv';

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

        // balls
        let colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
        let anims = ["sail1", "sail2", "sail3", "sail4", "sail5", "sail6"];

        var ballContainer = document.createElement("div");
        ballContainer.classList.add("ball-container");
        
        for(let i = 0; i < 5; i++) {
            let randSize = Math.floor(Math.random() * (50 - 25)) + 25;
            let randAnim = { 
                duration: Math.floor(Math.random() * (15 - 10) + 10),
                anim: anims[Math.floor(Math.random() * anims.length)]
            }

            let ball = document.createElement("div");
            ball.classList.add("ball");
            ball.style.animation = `${randAnim.duration}s infinite alternate ease-in-out ${randAnim.anim}`;
            ball.style.background = colors[Math.floor(Math.random() * colors.length)];
            ball.style.left = `${Math.floor(Math.random() * 75)}%`;
            ball.style.top = `${Math.floor(Math.random() * 75)}%`;
            ball.style.transform = `scale(${Math.random()})`;
            ball.style.width = `${randSize}em`;
            ball.style.height = `${randSize}em`;

            ballContainer.append(ball);
        }

        let elements = document.querySelectorAll('[data-balls-bg]');
        elements.forEach(function(node){
          node.append(ballContainer);
        });
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
            (bounding.top + elCenterHeight) >= 0) {
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
            <div id="hero-container" className="position-relative py-md-5" data-balls-bg>
                <div className="hero-slider container bg-rgba-white-90 shadow-lg rounded my-md-5 position-relative">
                    <div className="row">
                        <div className="col-md-8 py-md-5 pl-5 pr-1">
                            <h1 className="display-4 font-weight-bold">Connect with everyone, from anywhere</h1>
                            <p className="lead">
                                Text, call and chat with all your friends and contacts all over the world.
                                Fast, secure and encrypted on the web and your phone, right now.
                            </p>
                            <Link to='/getstarted' className="btn btn-danger">Get started</Link>
                        </div>
                        <div className="col-md-4 py-md-5 px-0 position-relative">
                            <div className={"product-device shadow-lg d-none d-md-block backdrop " + rotateClass}></div>
                            <div className={"product-device d-none d-md-block " + rotateClass}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}