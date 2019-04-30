import React, { Component } from 'react'
import './ButtonDropdown.scss'

export class ButtonDropdown extends Component {
    static dropdownEl = null;

    constructor(props) {
        super(props);
    }

    toggleDropdown = (e) => {
        if(this.dropdownEl == null) 
        {
            if(e.target.classList.contains('btn')) {
                this.dropdownEl = e.target.nextElementSibling;
            } else {
                this.dropdownEl = e.target.parentElement.nextElementSibling;

            }
        }

        this.dropdownEl.classList.toggle('show');
    }

    hideDropdown = () => {
        this.dropdownEl.classList.remove('show');
    }

    render() {
        return (
            <div id={this.props.id} 
                className={"button-dropdown-container " + this.props.className}>
                <button className={"btn " + this.props.btnClassName} 
                    onClick={this.toggleDropdown}>
                    <i className={this.props.btnIconClassName}/>
                </button>
                <div className="dropdown-menu">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

