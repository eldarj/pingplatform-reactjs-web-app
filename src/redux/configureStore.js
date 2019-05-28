// /src/redux/configureStore.js
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'js-cookie'

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './reducers'

// const persistConfig = {
//   key: 'rootx',
//   storage: new CookieStorage(Cookies, {
//       expiration: {
//           'default': 604800 // 7days
//       }
//   })
// }
const persistConfig = {
  key: 'rootx',
  storage: storage
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
 
export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}