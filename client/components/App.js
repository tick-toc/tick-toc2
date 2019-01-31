import React, {Component} from 'react'
import Bomb from './Bomb/Bomb'
import RefacBomb from './Bomb/RefacBomb'
import './../styles/App.css'
import Login from './Login'
import Main from './Main'
import NewGame from './NewGame'
import {Switch, Route, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class App extends Component {
  componentDidMount() {
    // Check if user is logged in
  }

  render() {
    console.log(this.props.user, '<<<USER?')
    return (
      <div className="App">
        {this.props.location.pathname !== '/diffusing' ||
          (this.props.location.pathname !== '/recap' && (
            <h1 className="App-title">TICK TOC</h1>
          ))}
        <Switch>
          <Route exact path="/" component={Main} />
          {/* ^^ Will render main-menu or Login, if logged in or not */}
          <Route exact path="/new-game" component={NewGame} />
          {/* ^^^ Will render game menu / game options */}
          <Route exact path="/previous-games" component={Login} />
          {/* ^^^ Will render previous games */}
          <Route exact path="/leaderboard" component={Login} />
          {/* ^^^ Will render leaderboard*/}
          <Route exact path="/diffusing" component={Bomb} />

          <Route exact path="/recap" component={RefacBomb} />
          {/* ^^^ Will render post game results */}
          <Route component={Login} />
        </Switch>
      </div>
    )
  }
}

const mapState = ({user}) => ({
  user
})

export default withRouter(connect(mapState, null)(App))
