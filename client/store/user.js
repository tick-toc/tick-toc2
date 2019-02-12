import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const IS_FETCHING = 'IS_FETCHING'
//add remove user for logging out

/**
 * INITIAL STATE
 */
const defaultUser = {
  user: {},
  isFetching: false
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const isFetching = () => ({type: IS_FETCHING})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    dispatch(isFetching())
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
    dispatch(isFetching())
  } catch (err) {
    console.error(err)
  }
}

//method
export const authLogin = (userName, password) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/login`, {userName, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/')
  } catch (loginError) {
    console.error(loginError)
  }
}

export const authSignup = (userName, password) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/signup`, {password, userName})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/')
  } catch (loginError) {
    console.error(loginError)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return {...state, user: action.user}
    case REMOVE_USER:
      return defaultUser
    case IS_FETCHING:
      return {...state, isFetching: !state.isFetching}
    default:
      return state
  }
}
