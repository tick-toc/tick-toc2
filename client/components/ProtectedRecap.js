import React from 'react'
import {Route, Redirect, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Recap from './Recap'

const ProtectedRecap = ({gameStatus, ...rest}) => {
  if (gameStatus === 'diffused' || gameStatus === 'failed') {
    return <Route {...rest} component={Recap} />
  } else {
    return <Redirect to="new-game" />
  }
}

const mapState = ({game: {gameStatus}}) => ({gameStatus})

export default withRouter(connect(mapState, null)(ProtectedRecap))
