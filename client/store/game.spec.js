import Reducer, * as Game from './game'
import {expect} from 'chai'

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
    describe('saveGame', () => {})

    describe('fetchLeaders', () => {})

    describe('fetchUserGames', () => {})
  })
})
