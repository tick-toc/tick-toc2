import React, {Component} from 'react'
import '../styles/Recap.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {resetGame, saveGame} from '../store'

class Recap extends Component {
  componentDidMount() {
    this.props.saveGame('testing 1 2 3')
  }

  handleClick = () => {
    this.props.resetGame()
  }

  render() {
    return (
      <div className="new-game-container">
        {/* Display game information here */}
        <Link onClick={this.handleClick} to="/" className="return">
          Return to main menu
        </Link>
        <Link onClick={this.handleClick} to="/new-game" className="return">
          Play again
        </Link>
      </div>
    )
  }
}

const mapState = ({game}) => ({...game})

const mapDispatch = dispatch => ({
  resetGame: () => dispatch(resetGame()),
  saveGame: game => dispatch(saveGame(game))
})

export default connect(mapState, mapDispatch)(Recap)
