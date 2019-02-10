import React, {Component} from 'react'
import '../styles/Recap.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {resetGame, saveGame, replayGame} from '../store'
import {calcSingleGameTime} from './util'
import SingleGame from './SingleGame'

class Recap extends Component {
  componentDidMount() {
    this.handleSave()
  }

  handleExit = () => {
    this.props.resetGame()
  }

  handleReplay = () => {
    this.props.replayGame()
  }

  handleSave = () => {
    const {
      startTime,
      finishTime,
      moduleTotal,
      strikeTotal,
      strikeCount,
      gameStatus: status
    } = this.props

    this.props.saveGame({
      startTime,
      finishTime,
      moduleTotal,
      strikeTotal,
      status
    })
  }

  render() {
    const {
      gameStatus,
      finishTime,
      startTime,
      moduleTotal,
      strikeTotal
    } = this.props
    const game = {gameStatus, finishTime, startTime, moduleTotal, strikeTotal}
    return (
      <div>
        <SingleGame game={game}>
          <Link onClick={this.handleExit} to="/" className="return">
            <button className="button" type="button">
              BACK
            </button>
          </Link>
          <Link onClick={this.handleReplay} to="/diffusing" className="return">
            <button className="button" type="button">
              {gameStatus === 'diffused' ? 'REPLAY' : 'RETRY'}
            </button>
          </Link>
        </SingleGame>
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
