/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import Reducer, * as User from './user'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('User', () => {
  describe('actions', () => {
    describe('getUser', () => {
      it('should create an action to get a user', () => {
        let user = {
          username: 'test',
          password: 'test'
        }
        expect(User.getUser(user)).to.deep.equal({type: User.GET_USER, user})
      })
    })
    describe('removeUser', () => {
      it('should create an action to remove a user', () => {
        expect(User.removeUser()).to.deep.equal({type: User.REMOVE_USER})
      })
    })
    describe('isFetching', () => {
      it('should create an action for fetching', () => {
        expect(User.isFetching()).to.deep.equal({type: User.IS_FETCHING})
      })
    })
  })

  describe('thunks', () => {
    let store
    let mockAxios

    const initialState = {user: {}}

    beforeEach(() => {
      mockAxios = new MockAdapter(axios)
      store = mockStore(initialState)
    })

    afterEach(() => {
      mockAxios.restore()
      store.clearActions()
    })

    describe('me', () => {
      it('eventually dispatches the GET USER action', async () => {
        const fakeUser = {email: 'Cody'}
        mockAxios.onGet('/auth/me').replyOnce(200, fakeUser)
        await store.dispatch(User.me())
        const actions = store.getActions()
        expect(actions[0].type).to.be.equal('IS_FETCHING')
        expect(actions[1].type).to.be.deep.equal('GET_USER')
        expect(actions[1].user).to.be.deep.equal(fakeUser)
        expect(actions[2].type).to.be.equal('IS_FETCHING')
      })
    })

    describe('logout', () => {
      it('logout: eventually dispatches the REMOVE_USER action', async () => {
        mockAxios.onPost('/auth/logout').replyOnce(204)
        await store.dispatch(User.logout())
        const actions = store.getActions()
        expect(actions[0].type).to.be.equal('REMOVE_USER')
        expect(history.location.pathname).to.be.equal('/login')
      })
    })
  })
})
