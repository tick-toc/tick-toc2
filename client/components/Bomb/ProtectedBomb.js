import React from 'react'
import {Route, Redirect, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

const ProtectedBomb = ({component: Component, gameStarted, ...rest}) => {
  if (gameStarted) {
    return <Route {...rest} component={Component} />
  } else {
    return <Redirect to="new-game" />
  }
}

const mapState = ({game: {gameStarted}}) => ({gameStarted})

export default withRouter(connect(mapState, null)(ProtectedBomb))
