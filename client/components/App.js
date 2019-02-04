import React, {Component, Fragment} from 'react'
import Bomb from './Bomb/Bomb'
import ProtectedBomb from './Bomb/ProtectedBomb'
import './../styles/App.css'
import {connect} from 'react-redux'
import Login from './Login'
import Main from './Main'
import NewGame from './NewGame'
import {Switch, Route, withRouter} from 'react-router-dom'
import {me} from '../store'

class App extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, isFetching} = this.props
    if (isFetching) return <div>Loading...</div>
    return (
      <div className="App">
        {this.props.location.pathname !== '/diffusing' && (
          <h1 className="App-title">TICK TOC</h1>
        )}
        {isLoggedIn ? (
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/new-game" component={NewGame} />
            {/* ^^^ Will render game menu / game options */}
            <Route exact path="/previous-games" component={Login} />
            {/* ^^^ Will render previous games */}
            <Route exact path="/leaderboard" component={Login} />
            {/* ^^^ Will render leaderboard*/}
            <ProtectedBomb exact path="/diffusing" component={Bomb} />
            <Route component={Main} />
            {/* ^^^ Will render post game results */}
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/recap" component={Bomb} />
            <Route component={Login} />
          </Switch>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.user.id,
    isFetching: state.user.isFetching
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData: () => dispatch(me())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(App))
