import React from 'react'
import {calcSingleGameTime} from './util'
import '../styles/SingleGame.css'

const SingleGame = props => {
  const {game} = props
  return (
    <div className="single-game">
      <div className="single-game--header">
        <div>CLASSIFIED INFORMATION: Exercise Security Policy S-9</div>
        <div>DO NOT DISCLOSE</div>
      </div>
      <div className="single-game--body">
        <div className="single-game--date">
          <span>Date</span>
          <div>
            {game.createdAt
              ? game.createdAt
              : new Date().toDateString().slice(4)}
          </div>
        </div>
        <div className="single-game--config">
          <span>Bomb Configuration</span>
          <div>
            <span>{calcSingleGameTime(game.startTime)}</span>
            <span>{`${game.moduleTotal} Modules`}</span>
            <span>{`${game.strikesAllowed} Strikes`}</span>
          </div>
        </div>
        <div className="single-game--result">
          <span>Result</span>
          <div className="single-game--status">
            {game.gameStatus ? game.gameStatus : game.status}
          </div>
          <div className="single-game--details">
            <span>Time Remaining:</span>
            <span>{calcSingleGameTime(game.finishTime)}</span>
          </div>
        </div>
      </div>
      <div className="single-game--links">{props.children}</div>
    </div>
  )
}

export default SingleGame
