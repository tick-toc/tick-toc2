import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router-dom'
import './styles/index.css'
import App from './components/App.js'
import {Provider} from 'react-redux'
import store from './store'
import history from './history'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
