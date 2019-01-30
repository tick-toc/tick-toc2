import React, {Component} from 'react'
import '../styles/Main.css'
import {Link} from 'react-router-dom'

class Main extends Component {
  handleClick = () => {
    // dispatch action to logout
  }

  render() {
    return (
      <div className="main-container">
        <Link to="new-game">Start New Game</Link>
        <Link to="previous-games">Previous Games</Link>
        <Link to="leaderboard">Leaderboard</Link>
        <button onClick={this.handleClick} type="button">
          Logout
        </button>
      </div>
    )
  }
}

// map state and props

export default Main // connect component
