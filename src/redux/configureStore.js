// /src/redux/configureStore.js
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'js-cookie'

import rootReducer from './reducers'
 
const persistConfig = {
  key: 'root',
  storage: new CookieStorage(Cookies/*, options */)
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
 
export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}