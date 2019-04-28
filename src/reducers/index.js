import { combineReducers } from 'redux'
import todos from './todos'
import account from './account'

export default combineReducers({
  todos,
  account
});