import React, {Component} from 'react'
import '../styles/Recap.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {resetGame, saveGame, replayGame} from '../store'
import {calcSingleGameTime} from './util'

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

  render() {
    const {
      gameStatus,
      finishTime,
      startTime,
      moduleTotal,
      strikeTotal
    } = this.props
    const time = calcSingleGameTime(startTime)
    const timeLeft = calcSingleGameTime(finishTime)

    return (
      <div>
        <div className="recap">
          <div className="recap--header">
            <div>CLASSIFIED INFORMATION: Exercise Security Policy S-9</div>
            <div>DO NOT DISCLOSE</div>
          </div>
          <div className="recap--body">
            <div className="recap--config">
              <span>Bomb Configuration</span>
              <div>
                <span>{time}</span>
                <span>{`${moduleTotal} Modules`}</span>
                <span>{`${strikeTotal} Strikes`}</span>
              </div>
            </div>
            <div className="recap--result">
              <span>Result</span>
              <div className="recap--status">{gameStatus}</div>
              <div className="recap--details">
                <span>Time Remaining:</span>
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>
          <div className="recap--links">
            <Link onClick={this.handleExit} to="/" className="return">
              BACK
            </Link>
            <Link
              onClick={this.handleReplay}
              to="/diffusing"
              className="return"
            >
              {gameStatus === 'diffused' ? 'REPLAY' : 'RETRY'}
            </Link>
          </div>
        </div>
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
