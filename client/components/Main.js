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
        <div>
          <div className="main-options">
            <Link className="main-option" to="new-game">
              Start Game
            </Link>
            <Link className="main-option" to="previous-games">
              Previous Games
            </Link>
            <Link className="main-option" to="leaderboard">
              Leaderboard
            </Link>
          </div>
          <Link to="/">
            <button
              className="button2 logout-button"
              onClick={this.handleClick}
              type="button"
            >
              Logout
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(null, mapDispatch)(Main)
