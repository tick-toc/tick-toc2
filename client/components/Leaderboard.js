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
    const {offset} = this.props.leaders
    this.props.fetchLeaders(offset)
  }

  render() {
    const {games} = this.props.leaders
    const selectedGame = games[this.state.selectedGame]
    if (!games || !selectedGame) return <FaCog className="loader" />
    return (
      <div className="leaderboard">
        <div className="leaders">
          <div>
            <div>LEADERBOARD</div>
            <table>
              <tbody className="leaders--table">
                <tr>
                  <th>RANK</th>
                  <th>PLAYER</th>
                  <th>
                    SOLVE<br /> TIME
                  </th>
                </tr>
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
          </div>
          <Link to="/" className="return">
            BACK
          </Link>
        </div>
        <SingleGame game={selectedGame} />
      </div>
    )
  }
}

const mapState = ({game: {leaders}}) => ({leaders})

const mapDispatch = dispatch => ({
  fetchLeaders: offset => dispatch(fetchLeaders(offset))
})

export default connect(mapState, mapDispatch)(Leaderboard)
