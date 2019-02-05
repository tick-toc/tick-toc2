import React, {Component} from 'react'
import '../styles/PreviousGames.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUserGames} from '../store'

class PreviousGames extends Component {
  state = {
    pageNumber: this.props.previousGames.pageNumber
  }

  componentDidMount() {
    this.props.fetchUserGames()
  }

  handlePageChange = event => {
    const {name} = event.target
    const {pageNumber} = this.state
    const {games} = this.props.previousGames
    if (pageNumber < games.length - 1 && name === 'previous') {
      this.setState(prevState => ({
        pageNumber: prevState.pageNumber + 1
      }))
    } else if (pageNumber > 0 && name === 'last') {
      this.setState(prevState => ({
        pageNumber: prevState.pageNumber - 1
      }))
    }
  }
  render() {
    // const {
    //   gameStatus,
    //   finishTime,
    //   startTime,
    //   moduleTotal,
    //   strikeTotal
    // } = this.props
    // const time = this.calcTime(startTime)
    // const timeLeft = this.calcTime(finishTime)
    console.log(this.props.previousGames, 'PREV GAMES')
    const {games} = this.props.previousGames
    if (games.length === 0) return <div>Loading...</div>
    return (
      <div>
        <div>{games[this.state.pageNumber].id}</div>
        <button type="button" name="last" onClick={this.handlePageChange}>
          LAST
        </button>
        <button type="button" name="previous" onClick={this.handlePageChange}>
          PREVIOUS
        </button>
        {/* <div className="recap">
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
              {time}
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
        </div> */}
      </div>
    )
  }
}

const mapState = ({game}) => ({...game})

const mapDispatch = dispatch => ({
  fetchUserGames: () => dispatch(fetchUserGames())
})

export default connect(mapState, mapDispatch)(PreviousGames)
