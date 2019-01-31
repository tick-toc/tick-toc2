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
      name: 'SubjectOfWires',
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

//ACTION CREATORS
export const startGame = settings => ({type: START_GAME, settings})
export const setStrike = () => ({type: SET_STRIKE})
export const passModule = moduleName => ({type: PASS_MODULE, moduleName})

// THUNK CREATORS

// here will go the saveGame thunk for storing it to the db

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
    default:
      return state
  }
}
