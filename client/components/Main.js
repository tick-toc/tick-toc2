import React, {Component} from 'react'
import '../styles/Main.css'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {connect} from 'react-redux'

class Main extends Component {
  handleClick = () => {
    event.preventDefault()
    this.props.logout()
  }

  render() {
    return (
      <div className="main-container">
        <Link to="new-game">Start New Game</Link>
        <Link to="previous-games">Previous Games</Link>
        <Link to="leaderboard">Leaderboard</Link>
        <Link to="/">
          <button onClick={this.handleClick} type="button">
            Logout
          </button>
        </Link>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    // state,
    logout: () => dispatch(logout())
  }
}

// map state and props
const ConnectedMain = connect(null, mapDispatch)(Main)
export default ConnectedMain
