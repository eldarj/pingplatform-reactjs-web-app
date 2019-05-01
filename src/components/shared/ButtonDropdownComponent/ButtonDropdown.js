import React, { Component } from 'react'
import './ButtonDropdown.scss'

export default class ButtonDropdown extends Component {
    static dropdownEl = null;

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
                    onClick={this.toggleDropdown}
                    onBlur={this.hideDropdown}>
                    <i className={this.props.btnIconClassName}/>
                </button>
                <div className={"dropdown-menu " + this.props.dropdownClassName}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

