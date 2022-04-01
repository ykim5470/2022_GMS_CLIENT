import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from '../src/redux/reducer'
import thunk from 'redux-thunk'
import App from './components/App.js'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

import './assets/css/index.css'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger)),
)

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
