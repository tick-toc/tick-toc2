import React, {Component} from 'react'
import '../styles/PreviousGames.css'
import '../styles/Loader.css'
import {FaCog} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUserGames} from '../store'
import SingleGame from './SingleGame'

class PreviousGames extends Component {
  state = {
    pageNumber: 0
  }

  componentDidMount() {
    const {offset, games} = this.props.previousGames
    if (games.length === 0) {
      this.props.fetchUserGames(offset)
    }
  }

  componentDidUpdate() {
    const {offset, games} = this.props.previousGames
    if (
      this.state.pageNumber > Math.round(games.length * 0.75) &&
      games.length % offset === 0
    ) {
      this.props.fetchUserGames(offset)
    }
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
    const {games} = this.props.previousGames
    const game = games[this.state.pageNumber]
    if (!game) return <FaCog className="loader" />
    return (
      <div>
        <SingleGame game={game}>
          <Link to="/">
            <button className="button" type="button">
              BACK
            </button>
          </Link>
          <div>
            {this.state.pageNumber > 0 && (
              <button
                type="button"
                className="button"
                name="last"
                onClick={this.handlePageChange}
              >
                PREVIOUS
              </button>
            )}
            <button
              type="button"
              name="previous"
              className="button"
              onClick={this.handlePageChange}
            >
              NEXT
            </button>
          </div>
        </SingleGame>
      </div>
    )
  }
}

const mapState = ({game: {previousGames}}) => ({previousGames})

const mapDispatch = dispatch => ({
  fetchUserGames: offset => dispatch(fetchUserGames(offset))
})

export default connect(mapState, mapDispatch)(PreviousGames)
