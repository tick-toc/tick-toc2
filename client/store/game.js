/* eslint-disable no-case-declarations */

import axios from 'axios'

const initialGame = {
  startTime: 300,
  minTime: 30,
  maxTime: 570,
  finishTime: 0,
  moduleTotal: 5,
  modulesPassed: 0,
  strikesAllowed: true,
  strikeTotal: 3,
  strikeCount: 0,
  modules: [
    {
      name: 'Wires',
      passed: false
    },
    {
      name: 'BigButton',
      passed: false
    },
    {
      name: 'Letters',
      passed: false
    },
    {
      name: 'Keys',
      passed: false
    }
  ],
  gameStarted: false,
  gameStatus: 'pending'
}

//ACTION TYPES
const START_GAME = 'START_GAME'
const SET_STRIKE = 'SET_STRIKE'
const PASS_MODULE = 'PASS_MODULE'
const DIFFUSED = 'DIFFUSED'
const END_GAME = 'END_GAME'
const RESET_GAME = 'RESET_GAME'
const REPLAY_GAME = 'REPLAY_GAME'

//ACTION CREATORS
export const startGame = settings => ({type: START_GAME, settings})
export const setStrike = () => ({type: SET_STRIKE})
export const passModule = moduleName => ({type: PASS_MODULE, moduleName})
export const diffused = () => ({type: DIFFUSED})
export const endGame = status => ({type: END_GAME, status})
export const resetGame = () => ({type: RESET_GAME})
export const replayGame = () => ({type: REPLAY_GAME})

// THUNK CREATORS

export const saveGame = game => async () => {
  try {
    const result = await axios.post('/api/games', game)
    console.log(result, '<<RESULT')
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialGame, action) {
  switch (action.type) {
    case START_GAME:
      const {startTime, strikesAllowed} = action.settings
      const strikeTotal = strikesAllowed ? 3 : 1
      return {
        ...state,
        startTime,
        strikeTotal,
        strikesAllowed,
        gameStarted: true
      }
    case PASS_MODULE:
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.name === action.moduleName) module.passed = true
          return module
        }),
        modulesPassed: state.modulesPassed + 1
      }
    case SET_STRIKE:
      return {
        ...state,
        strikeCount: state.strikeCount + 1
      }
    case END_GAME:
      return {...state, gameStatus: action.status}
    case RESET_GAME:
      return initialGame
    case REPLAY_GAME:
      return {
        ...initialGame,
        startTime: state.startTime,
        gameStarted: state.gameStarted,
        strikesAllowed: state.strikesAllowed,
        strikeTotal: state.strikeTotal
      }
    default:
      return state
  }
}
