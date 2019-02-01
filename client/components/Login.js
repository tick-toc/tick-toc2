import React, {Component} from 'react'
import {connect} from 'react-redux'
import {authSignup, authLogin} from '../store'
import '../styles/Login.css'

class Login extends Component {
  state = {
    login: true,
    email: '',
    username: '',
    password: ''
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
        <form onSubmit={this.handleSubmit} className="login-form">
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

const mapDispatch = dispatch => {
  return {
    authLogin: (email, password) => dispatch(authLogin(email, password)),
    authSignup: (email, password, userName) =>
      dispatch(authSignup(email, password, userName))
  }
}

export default connect(null, mapDispatch)(Login)
