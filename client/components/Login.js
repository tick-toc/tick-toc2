import React, {Component} from 'react'
import '../styles/Login.css'

class Login extends Component {
  state = {
    login: true,
    email: '',
    username: '',
    password: ''
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.state.login) console.log('LOGGING IN ACTION')
    else console.log('SIGNING UP ACTION')
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
        <button onClick={this.handleClick}>
          {this.state.login
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>
    )
  }
}

// map state and props

export default Login // connect to store
