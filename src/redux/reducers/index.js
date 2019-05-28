import { combineReducers } from 'redux'
import account from './account'
import contacts from './contacts'

export default combineReducers({
  account, contacts
});