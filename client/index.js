import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import './styles/index.css'
import App from './components/App.js'
import IsMobile from './components/IsMobile.js'
import {Provider} from 'react-redux'
import store from './store'
import {isMobile} from 'react-device-detect'

// establishes socket connection
import './socket'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>{isMobile ? <IsMobile /> : <App />}</BrowserRouter>
  </Provider>,
  document.getElementById('app')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
