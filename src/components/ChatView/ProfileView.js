import React, { Component } from 'react';
import { connect } from 'react-redux'
import AddTodo from '../../containers/AddTodo';
import TodoList from '../../containers/TodoList';

export class ProfileView extends Component {
    
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div className="my-5 py-5">
                <div className="container">
                    <div className="row">
                        <div className="mx-auto col-sm-12 text-center">
                            <h1>
                               Profile
                            </h1>
                            <AddTodo />
                            <TodoList />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}