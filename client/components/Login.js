import React, {Component} from 'react'
import {connect} from 'react-redux'
import {authSignup, authLogin} from '../store'
import {Link} from 'react-router-dom'
import '../styles/Login.css'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    console.log('this.props', this.props)

    this.state = {
      login: true, //login view
      email: '',
      username: '',
      password: ''
    }
  }
  handleSubmit = event => {
    const {email, username, password} = this.state
    event.preventDefault()
    if (this.state.login) this.props.authLogin(email, password)
    else this.props.authSignup(email, password, username)
  }

  handleChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleClick = () => {
    this.setState(prevState => ({
      login: !prevState.login
    }))
  }

  render() {
    return (
      <div className="login-form-container">
        <form
          onSubmit={async evt => {
            await this.handleSubmit(evt)
          }}
          className="login-form"
        >
          <input
            name="email"
            onChange={this.handleChange}
            value={this.state.email}
            placeholder="email"
          />
          {!this.state.login && (
            <input
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
              placeholder="username"
            />
          )}
          <input
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            placeholder="password"
          />
          <button type="submit">
            {this.state.login ? 'Log in' : 'Sign up'}
          </button>
        </form>
        <button type="submit" onClick={this.handleClick}>
          {this.state.login
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>
    )
  }
}

/**
 * Here we will implement
 */
// map state and props

const mapProps = dispatch => {
  return {
    // state,
    authLogin: (email, password) => dispatch(authLogin(email, password)),
    authSignup: (email, password, userName) =>
      dispatch(authSignup(email, password, userName))
  }
}

// const mapSignup = state => {
//   return {
//     name: 'signup',
//     displayName: 'Sign Up',
//     error: state.user.error,
//     state,
//     userId: state.user.id
//   }
// }

export const Login = connect(null, mapProps)(LoginForm)

// export const LoginForm = connect(mapLogin, mapDispatch)(Login) // connect to store
