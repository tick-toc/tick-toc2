/* eslint-disable no-case-declarations */
/* eslint-disable complexity */

import axios from 'axios'

const initialGame = {
  startTime: 300,
  minTime: 30,
  maxTime: 570,
  finishTime: 0,
  moduleTotal: 2,
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
      name: 'Maze',
      passed: false
    }
  ],
  gameStarted: false,
  gameStatus: 'pending',
  previousGames: {
    games: [],
    offset: 0
  },
  leaders: {
    games: [],
    offset: 0
  }
}

//ACTION TYPES
const START_GAME = 'START_GAME'
const SET_STRIKE = 'SET_STRIKE'
const PASS_MODULE = 'PASS_MODULE'
const DIFFUSED = 'DIFFUSED'
const END_GAME = 'END_GAME'
const RESET_GAME = 'RESET_GAME'
const REPLAY_GAME = 'REPLAY_GAME'
const GET_USER_GAMES = 'GET_USER_GAMES'
const GET_LEADERS = 'GET_LEADERS'

//ACTION CREATORS
export const startGame = settings => ({type: START_GAME, settings})
export const setStrike = () => ({type: SET_STRIKE})
export const passModule = moduleName => ({type: PASS_MODULE, moduleName})
export const diffused = () => ({type: DIFFUSED})
export const endGame = (status, finishTime) => ({
  type: END_GAME,
  status,
  finishTime
})
export const resetGame = () => ({type: RESET_GAME})
export const replayGame = () => ({type: REPLAY_GAME})
const getUserGames = data => ({type: GET_USER_GAMES, data})
const getLeaders = data => ({type: GET_LEADERS, data})

// THUNK CREATORS

export const saveGame = game => async () => {
  try {
    const result = await axios.post('/api/games', game)
  } catch (err) {
    console.error(err)
  }
}

export const fetchLeaders = offset => async dispatch => {
  try {
    const {data} = await axios.get(`/api/games/${offset}`)
    dispatch(getLeaders(data))
  } catch (err) {
    console.error(err)
  }
}

export const fetchUserGames = offset => async dispatch => {
  try {
    const {data} = await axios.get(`/api/games/previous/${offset}`)
    dispatch(getUserGames(data))
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
      return {
        ...state,
        gameStatus: action.status,
        finishTime: action.finishTime
      }
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
    case GET_USER_GAMES:
      return {
        ...state,
        previousGames: {
          ...state.previousGames,
          games: [...state.previousGames.games, ...action.data.games],
          offset: state.previousGames.offset + action.data.limit
        }
      }
    case GET_LEADERS:
      return {
        ...state,
        leaders: {
          games: [...state.leaders.games, ...action.data.games],
          offset: state.leaders.offset + action.data.offset
        }
      }
    default:
      return state
  }
}
