import React from 'react'
import { connect } from 'react-redux'

const TodoList = ({ todos, account }) => {
    return (
        <div>
            {account.id}{account.phoneNumber}xx
            <ul>
                {todos.map(item => (
                    <li key={item.text}>{item.text}</li>
                ))}
            </ul>
        </div>
    )
}

const mapStateToProps = state => ({
    todos: state.todos,
    account: state.account
});

export default connect(mapStateToProps)(TodoList)