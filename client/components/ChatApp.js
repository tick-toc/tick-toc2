import React, {Fragment} from 'react'

class ChatApp extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleLoad)
  }

  handleLoad() {}
  render() {
    return (
      <Fragment>
        <h1 className="ui header">Simple WebRTC Messenger</h1>
        <hr />
      </Fragment>
    )
  }
}

export default ChatApp
