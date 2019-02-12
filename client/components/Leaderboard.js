import React, {Component} from 'react'
import '../styles/Leaderboard.css'
import '../styles/Loader.css'
import {FaCog} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import SingleGame from './SingleGame'
import {connect} from 'react-redux'
import {fetchLeaders} from '../store'
import {calcSingleGameTime} from './util'

class Leaderboard extends Component {
  state = {
    selectedGame: 0
  }

  handleClick = index => {
    this.setState({
      selectedGame: index
    })
  }

  componentDidMount() {
    const {games} = this.props.leaders
    if (games.length === 0) {
      this.props.fetchLeaders()
    }
  }

  render() {
    const {games} = this.props.leaders
    const selectedGame = games[this.state.selectedGame]
    if (!games || !selectedGame) return <FaCog className="loader" />
    return (
      <div className="leaderboard">
        <div className="leaders">
          <div className="leaders--header">LEADERBOARD</div>
          <table>
            <tbody>
              <tr className="leaders-table--headers">
                <th>RANK</th>
                <th>PLAYER</th>
                <th>SOLVE TIME</th>
              </tr>
            </tbody>
            <tbody className="leaders-table">
              {games.map((game, index) => {
                const {user: {userName}, finishTime, startTime} = game
                return (
                  <tr
                    className="leader-row"
                    key={game.id}
                    onClick={() => this.handleClick(index)}
                  >
                    <td>{index + 1}</td>
                    <td>{userName}</td>
                    <td>{calcSingleGameTime(startTime - finishTime)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Link to="/" className="return">
            <button className="button" type="button">
              BACK
            </button>
          </Link>
        </div>
        <SingleGame game={selectedGame} />
      </div>
    )
  }
}

const mapState = ({game: {leaders}}) => ({leaders})

const mapDispatch = dispatch => ({
  fetchLeaders: () => dispatch(fetchLeaders())
})

export default connect(mapState, mapDispatch)(Leaderboard)
