import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import {sessionService} from 'redux-react-session'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from '../src/redux/reducer'
import thunk from 'redux-thunk'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

import './assets/css/index.css'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger)),
)

const validateSession = (session) =>{
  return true
}

const options = {refreshOnCheckAuth: true, redirectPath: '/login' , driver: "COOKIES", validateSession}

sessionService.initSessionService(store, options).then(()=>{console.log('Redux React Session is ready and a session was refreshed from your storage')}).catch(()=>{
  console.log('Redux React Session is ready and there is no session in your storage')
})

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
)

reportWebVitals()
