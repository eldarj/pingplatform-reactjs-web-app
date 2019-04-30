import React, { Component } from 'react';
import './FloatBox.scss';

export class FloatBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible != null ? props.visible : true
        }
    }

    onCloseClick = () => {
        this.setState({
            visible: false
        })
    }

    renderFloatBoxHtml() {
        if(!this.state.visible) return null;
        return (
            <div className="col-sm-2 fixed-bottom m-4 bg-light border rounded shadow-lg">
                <div className="small py-3 pl-2 pr-3">
                    <div className="close btn btn-light" onClick={this.onCloseClick}>
                        <i className="fas fa-times"></i>
                    </div>
                    <div className="text-secondary mb-3">{this.props.text}</div>
                        <a className="mr-1 btn btn-xs btn-danger" href={this.props.link} >
                            {this.props.linkDisplayName}
                        </a>
                        {this.props.children}
                </div>
            </div>
        );
    }

    render() {
        return (
            this.renderFloatBoxHtml()
        );
    }
}

