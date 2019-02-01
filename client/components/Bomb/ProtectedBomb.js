import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

const ProtectedBomb = ({component: Component, gameStarted, ...rest}) => {
  if (gameStarted) {
    return <Route {...rest} render={() => <Component />} />
  } else {
    return <Redirect to="new-game" />
  }
}

const mapState = ({game: {gameStarted}}) => ({gameStarted})

export default connect(mapState, null)(ProtectedBomb)
