import Reducer, * as Game from './game'
import {expect} from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('Game', () => {
  describe('actions', () => {
    describe('setStrike', () => {
      it('should create an action to set a strike', () => {
        expect(Game.setStrike()).to.deep.equal({type: Game.SET_STRIKE})
      })
    })

    describe('startGame', () => {
      it('should create an action to start a game', () => {
        let settings = {
          startTime: 300,
          strikesAllowed: true,
          strikeTotal: 3
        }
        expect(Game.startGame(settings)).to.deep.equal({
          type: Game.START_GAME,
          settings
        })
      })
    })

    describe('passModule', () => {
      it('should create an action to pass a module', () => {
        let moduleName = 'Wires'
        expect(Game.passModule(moduleName)).to.deep.equal({
          type: Game.PASS_MODULE,
          moduleName
        })
      })
    })

    describe('diffused', () => {
      it('should create an action to mark diffused', () => {
        expect(Game.diffused()).to.deep.equal({type: Game.DIFFUSED})
      })
    })

    describe('endGame', () => {
      it('should create an action to end a game', () => {
        let status = 'diffused'
        let finishTime = 24
        expect(Game.endGame(status, finishTime)).to.deep.equal({
          type: Game.END_GAME,
          status,
          finishTime
        })
      })
    })

    describe('resetGame', () => {
      it('should create an action to reset a game', () => {
        expect(Game.resetGame()).to.deep.equal({type: Game.RESET_GAME})
      })
    })

    describe('replayGame', () => {
      it('should create an action to replay a game', () => {
        expect(Game.replayGame()).to.deep.equal({type: Game.REPLAY_GAME})
      })
    })

    describe('getUserGames', () => {
      it('should create an action to get a users games', () => {
        let data = {}
        expect(Game.getUserGames(data)).to.deep.equal({
          type: Game.GET_USER_GAMES,
          data
        })
      })
    })

    describe('getLeaders', () => {
      it('should create an action to get leaders', () => {
        let data = {}
        expect(Game.getLeaders(data)).to.deep.equal({
          type: Game.GET_LEADERS,
          data
        })
      })
    })

    describe('isDoneFetching', () => {
      it('should create an action to indicate fetching is done', () => {
        let view = 'leaders'
        expect(Game.isDoneFetching(view)).to.deep.equal({
          type: Game.IS_DONE_FETCHING,
          view
        })
      })
    })
  })

  describe('thunks', () => {
    let store
    let mockAxios

    const initialState = {}

    beforeEach(() => {
      store = mockStore(initialState)
      mockAxios = new MockAdapter(axios)
    })

    afterEach(() => {
      mockAxios.restore()
      store.clearActions()
    })

    describe('saveGame', () => {
      it('should post game to /api/games', async () => {
        mockAxios.onPost('/api/games').replyOnce(200)
        await store.dispatch(Game.saveGame())
        expect(mockAxios.history.post.length).to.equal(1)
      })
    })

    describe('fetchLeaders', () => {
      it('should fetch leaders, dispatch actions getLeaders & isDoneFetching', async () => {
        mockAxios.onGet('/api/games/').replyOnce(200)
        await store.dispatch(Game.fetchLeaders())
        const actions = store.getActions()
        expect(mockAxios.history.get.length).to.equal(1)
        expect(actions[0].type).to.equal('GET_LEADERS')
        expect(actions[1].type).to.equal('IS_DONE_FETCHING')
      })
    })

    describe('fetchUserGames', () => {
      it('should fetch users games', async () => {
        const offset = 20
        mockAxios.onGet(`/api/games/previous/${offset}`).replyOnce(200)
        await store.dispatch(Game.fetchUserGames(offset))
        const actions = store.getActions()
        expect(mockAxios.history.get.length).to.equal(1)
        expect(actions[0].type).to.equal('GET_USER_GAMES')
        expect(actions[1].type).to.equal('IS_DONE_FETCHING')
      })
    })
  })

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(Reducer(undefined, {})).to.deep.equal({
        startTime: 180,
        minTime: 30,
        maxTime: 360,
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
            name: 'Maze',
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
        gameStatus: 'pending',
        previousGames: {
          games: [],
          offset: 0,
          isDoneFetching: false
        },
        leaders: {
          games: [],
          isDoneFetching: false
        }
      })
    })
  })
})
