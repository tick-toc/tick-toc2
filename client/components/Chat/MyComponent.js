import React, {Component} from 'react'
import {withWebRTC} from 'react-liowebrtc'

class MyComponent extends Component {
  handleClick = () => this.props.webrtc.shout('event-label', 'payload')

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }
}

export default withWebRTC(MyComponent)
