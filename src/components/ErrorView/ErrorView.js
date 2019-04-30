import React, { Component } from 'react'

export class ErrorView extends Component {
    constructor(props) {
        super(props);

        console.log(props);
        console.log(props.location.state);

        this.state = {
            propMessage: ''
        };
    }

    render() {
        return (
            <div className="align-items-center d-flex flex-grow-1 py-5">
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-sm-12 text-center">
                            <h1>
                                We're sorry, we can't handle your request at this time - please try again.
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}