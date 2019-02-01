/* eslint-disable no-case-declarations */

import axios from 'axios'

const initialGame = {
  startTime: 300,
  minTime: 30,
  maxTime: 570,
  finishTime: 0,
  moduleTotal: 2,
  minMod: 2,
  maxMod: 2,
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
    }
  ],
  gameStarted: false,
  gameStatus: 'pending' // is this even needed?
}

//ACTION TYPES
const START_GAME = 'START_GAME'
const SET_STRIKE = 'SET_STRIKE'
const PASS_MODULE = 'PASS_MODULE'
const DIFFUSED = 'DIFFUSED'
const END_GAME = 'END_GAME'

//ACTION CREATORS
export const startGame = settings => ({type: START_GAME, settings})
export const setStrike = () => ({type: SET_STRIKE})
export const passModule = moduleName => ({type: PASS_MODULE, moduleName})
export const diffused = () => ({type: DIFFUSED})
export const endGame = status => ({type: END_GAME, status})
// THUNK CREATORS

export default function(state = initialGame, action) {
  switch (action.type) {
    case START_GAME:
      const {moduleTotal, startTime, strikesAllowed} = action.settings
      const strikeTotal = strikesAllowed ? 3 : 0
      return {
        ...state,
        moduleTotal,
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
    default:
      return state
  }
}
