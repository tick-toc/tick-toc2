import React from 'react'
import {Route, Redirect, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Bomb from './Bomb/Bomb'

const ProtectedBomb = ({gameStarted, ...rest}) => {
  if (gameStarted) {
    return <Route {...rest} component={Bomb} />
  } else {
    return <Redirect to="new-game" />
  }
}

const mapState = ({game: {gameStarted}}) => ({gameStarted})

export default withRouter(connect(mapState, null)(ProtectedBomb))
