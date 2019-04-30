import React, { Component } from 'react';

export class BallsDiv extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    renderRandomBalls() {
        let colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
        let anims = ["sail1", "sail2", "sail3", "sail4", "sail5", "sail6"];
        let balls = [];

        for(let i = 0; i < 5; i++) {
            let randSize = Math.floor(Math.random() * (50 - 25)) + 25;
            let randAnim = { 
                duration: Math.floor(Math.random() * (15 - 10) + 10),
                anim: anims[Math.floor(Math.random() * anims.length)]
            }

            balls.push({
                animation: `${randAnim.duration}s infinite alternate ease-in-out ${randAnim.anim}`,
                background: colors[Math.floor(Math.random() * colors.length)],
                width: `${randSize}em`,
                height: `${randSize}em`,
                left: `${Math.floor(Math.random() * 75)}%`,
                top: `${Math.floor(Math.random() * 75)}%`,
                scale: `scale(${Math.random()})`
            });
        }

        return (
            <div className="ball-container">
                {balls.map((ball, i) => {
                    return <div key={i} className="ball" style={{
                        animation: ball.animation,
                        background: ball.background,
                        width: ball.width,
                        height: ball.height,
                        left: ball.left,
                        top: ball.top,
                        transform: ball.scale
                    }}></div>
                })}
            </div>
      );
    }

    render() {
        return (
            <div id={this.props.id} className={"got-balls" + this.props.className}>
                {this.props.children}
                {this.renderRandomBalls()}
            </div>
        );
    }
}
