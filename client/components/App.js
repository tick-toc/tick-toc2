import React, {Component} from 'react'
import Bomb from './Bomb/Bomb'
import RefacBomb from './Bomb/RefacBomb'
import './../styles/App.css'
import {connect} from 'react-redux'
import {Login} from './Login'
import Main from './Main'
import NewGame from './NewGame'
import {Switch, Route, withRouter} from 'react-router-dom'
import {me} from '../store'

class App extends Component {
  componentDidMount() {
    // Check if user is logged in
  }

  render() {
    const {isLoggedIn} = this.props
    console.log(isLoggedIn, '<<<?')
    return (
      <div className="App">
        {this.props.location.pathname !== '/diffusing' ||
          (this.props.location.pathname !== '/recap' && (
            <h1 className="App-title">TICK TOC</h1>
          ))}
        <Switch>
          {isLoggedIn && (
            <React.Fragment>
              <Route exact path="/" component={Main} />
              <Route exact path="/new-game" component={NewGame} />
              {/* ^^^ Will render game menu / game options */}
              <Route exact path="/previous-games" component={Login} />
              {/* ^^^ Will render previous games */}
              <Route exact path="/leaderboard" component={Login} />
              {/* ^^^ Will render leaderboard*/}
              <Route exact path="/diffusing" component={R} />
              <Route exact path="/recap" component={RefacBomb} />
              <Route component={Main} />
              {/* ^^^ Will render post game results */}
            </React.Fragment>
          )}
        </Switch>
        <Switch>
          {/* ^^ Will render main-menu or Login, if logged in or not */}
          <Route exact path="/" component={Login} />
          <Route exact path="/recap" component={RefacBomb} />
          <Route exact path="/diffusing" component={Bomb} />
          <Route component={Login} />
        </Switch>
      </div>
    )
  }
}

const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(App))
