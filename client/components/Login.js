import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {authSignup, authLogin} from '../store'
import '../styles/Login.css'

class Login extends Component {
  state = {
    login: true,
    username: '',
    password: ''
  }

  handleSubmit = event => {
    const {username, password} = this.state
    event.preventDefault()
    if (this.state.login) this.props.authLogin(username, password)
    else this.props.authSignup(password, username)
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
      <Fragment>
        <div className="login-form-container">
          <div>
            <form onSubmit={this.handleSubmit} className="login-form">
              <div className="login-fields-container">
                <div className="login-field-labels">
                  <div>username</div>
                  <div>password</div>
                </div>
                <div className="login-fields">
                  <input
                    required
                    name="username"
                    onChange={this.handleChange}
                    value={this.state.username}
                  />
                  <input
                    required
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                </div>
              </div>
              <button className="button2 login-signup--button" type="submit">
                {this.state.login ? 'Login' : 'Signup'}
              </button>
            </form>
          </div>
        </div>
        <div className="switch-container">
          <div>
            <button
              className="button2 login-switch--button"
              type="button"
              onClick={this.handleClick}
            >
              {this.state.login
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    authLogin: (userName, password) => dispatch(authLogin(userName, password)),
    authSignup: (userName, password) => dispatch(authSignup(userName, password))
  }
}

export default connect(null, mapDispatch)(Login)
