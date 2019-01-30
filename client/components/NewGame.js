import React, {Component} from 'react'
import '../styles/NewGame.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {startGame} from '../store/game'
import {
  FaRegArrowAltCircleLeft as FaArrowL,
  FaRegArrowAltCircleRight as FaArrowR
} from 'react-icons/fa'

class NewGame extends Component {
  state = {
    startTime: this.props.startTime,
    moduleTotal: this.props.moduleTotal,
    strikesAllowed: this.props.strikesAllowed
  }

  handleStart = () => {
    const {moduleTotal, startTime, strikesAllowed} = this.state
    this.props.startGame({
      moduleTotal,
      startTime,
      strikesAllowed
    })
    this.props.history.push('/diffusing')
  }

  handleModule = char => {
    const {moduleTotal} = this.state
    const {minMod, maxMod} = this.props
    if (moduleTotal > minMod && char === 'l') {
      this.setState(prevState => ({moduleTotal: prevState.moduleTotal - 1}))
    } else if (moduleTotal < maxMod && char === 'm') {
      this.setState(prevState => ({moduleTotal: prevState.moduleTotal + 1}))
    }
  }

  handleTime = char => {
    const {startTime} = this.state
    const {minTime, maxTime} = this.props

    if (startTime > minTime && char === 'l') {
      this.setState(prevState => ({startTime: prevState.startTime - 30}))
    } else if (startTime < maxTime && char === 'm') {
      this.setState(prevState => ({startTime: prevState.startTime + 30}))
    }
  }

  handleStrikes = state => {
    if (state === 'on') this.setState({strikesAllowed: true})
    else if (state === 'off') this.setState({strikesAllowed: false})
  }

  render() {
    const {startTime, moduleTotal, strikesAllowed} = this.state
    const minute = Math.floor(startTime / 60)
    const seconds = startTime % 60
    return (
      <div className="new-game-container">
        <Link to="/" className="return">
          Return to menu
        </Link>
        <div className="new-game-options">
          <div>
            <span>Time</span>
            <span>
              <FaArrowL
                className="ng-action ng-icon"
                onClick={() => this.handleTime('l')}
              />
              {minute}:{seconds === 0 ? '00' : seconds}
              <FaArrowR
                className="ng-action ng-icon"
                onClick={() => this.handleTime('m')}
              />
            </span>
          </div>
          <div>
            <span>Modules</span>
            <span>
              <FaArrowL
                className="ng-action ng-icon"
                onClick={() => this.handleModule('l')}
              />
              {moduleTotal}
              <FaArrowR
                className="ng-action ng-icon"
                onClick={() => this.handleModule('m')}
              />
            </span>
          </div>
          <div>
            <span>Strikes</span>
            <div>
              <span
                className={`${
                  strikesAllowed ? 'strike ng-action' : 'ng-action'
                }`}
                onClick={() => this.handleStrikes('on')}
              >
                ON
              </span>
              <span
                className={`${
                  strikesAllowed ? 'ng-action' : 'strike ng-action'
                }`}
                onClick={() => this.handleStrikes('off')}
              >
                OFF
              </span>
            </div>
          </div>
          <div className="ng-action" onClick={this.handleStart}>
            Start Game
          </div>
        </div>
      </div>
    )
  }
}

const mapState = ({game}) => ({...game})
const mapProps = dispatch => ({
  startGame: settings => {
    dispatch(startGame(settings))
  }
})
export default connect(mapState, mapProps)(NewGame)
