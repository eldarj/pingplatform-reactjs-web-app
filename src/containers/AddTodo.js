import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'
import { setAccount } from '../actions'

const AddTodo = ({ dispatch }) => {
    let input
  
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            console.log('dispatch');
            dispatch(addTodo(input.value));
            dispatch(setAccount(5, '38762001111'));
            input.value = ''
          }}
        >
          <input ref={node => (input = node)} />
          <button type="submit">Add Todo</button>
        </form>
      </div>
    )
  }
  
  export default connect()(AddTodo)