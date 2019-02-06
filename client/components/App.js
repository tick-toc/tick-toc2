import React, {Component, Fragment} from 'react'
import Bomb from './Bomb/Bomb'
import ProtectedBomb from './ProtectedBomb'
import ProtectedRecap from './ProtectedRecap'
import './../styles/App.css'
import './../styles/Loader.css'
import {FaCog} from 'react-icons/fa'
import {connect} from 'react-redux'
import Login from './Login'
import Main from './Main'
import NewGame from './NewGame'
import Leaderboard from './Leaderboard'
import PreviousGames from './PreviousGames'
import {Switch, Route, withRouter} from 'react-router-dom'
import {me} from '../store'
import ChatApp from './Chat/ChatApp'
import VideoChat from './Chat/VideoChat'

class App extends Component {
  componentDidMount() {
    this.props.loadInitialData()
    // window.addEventListener('load', () => {
    //   this.props.
    // })
  }

  render() {
    const {isLoggedIn, isFetching} = this.props
    if (isFetching) return <FaCog className="loader" />
    return (
      <Fragment>
        {isLoggedIn ? (
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/new-game" component={NewGame} />
            <Route exact path="/previous-games" component={PreviousGames} />
            <Route exact path="/leaderboard" component={Leaderboard} />
            <ProtectedRecap exact path="/recap" />
            <ProtectedBomb exact path="/diffusing" />
            <Route exact path="/chat" component={ChatApp} />
            <Route exact path="/VideoChat" component={VideoChat} />
            <Route component={Main} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/chat" component={ChatApp} />
            <Route exact path="/video" component={VideoChat} />
            <Route component={Login} />
          </Switch>
        )}
      </Fragment>
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
    // fetchWebRTC: () => dispatch(Stream())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(App))
