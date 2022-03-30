import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

import './assets/css/index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)

reportWebVitals()
