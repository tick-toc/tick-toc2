import axios from 'axios'

const initialGame = {
  startTime: 300,
  minTime: 30,
  maxTime: 570,
  finishTime: 0,
  moduleTotal: 2,
  minMod: 2,
  maxMod: 2,
  modulesCompleted: 0,
  strikesAllowed: true,
  strikeCount: 0,
  SubjectOfWires: {
    active: true,
    passed: false
  },
  gameStarted: false,
  gameStatus: 'pending'
}

//ACTION TYPES
const START_GAME = 'START_GAME'

//ACTION CREATORS
export const startGame = settings => ({type: START_GAME, settings})

// THUNK CREATORS

// here will go the saveGame thunk for storing it to the db

export default function(state = initialGame, action) {
  switch (action.type) {
    case START_GAME:
      const {moduleTotal, startTime, strikesAllowed} = action.settings
      const strikes = strikesAllowed ? 3 : 0
      return {
        ...state,
        moduleTotal,
        startTime,
        strikesAllowed: strikes,
        gameStarted: true
      }
    default:
      return state
  }
}
