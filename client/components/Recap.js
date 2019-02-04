import React, {Component} from 'react'
import '../styles/Recap.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {resetGame, saveGame, replayGame} from '../store'

class Recap extends Component {
  componentDidMount() {
    const {
      startTime,
      finishTime,
      moduleTotal,
      strikeTotal,
      strikeCount
    } = this.props

    this.props.saveGame({
      startTime,
      finishTime,
      moduleTotal,
      strikeTotal,
      strikeCount
    })
  }

  handleExit = () => {
    this.props.resetGame()
  }

  handleReplay = () => {
    this.props.replayGame()
  }

  render() {
    return (
      <div className="new-game-container">
        {/* Display game information here */}
        <Link onClick={this.handleExit} to="/" className="return">
          Back
        </Link>
        <Link onClick={this.handleReplay} to="/diffusing" className="return">
          Replay
        </Link>
      </div>
    )
  }
}

const mapState = ({game}) => ({...game})

const mapDispatch = dispatch => ({
  resetGame: () => dispatch(resetGame()),
  saveGame: game => dispatch(saveGame(game)),
  replayGame: () => dispatch(replayGame())
})

export default connect(mapState, mapDispatch)(Recap)
