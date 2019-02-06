import React, {Component} from 'react'
import {LioWebRTC, LocalVideo, RemoteVideo} from 'react-liowebrtc'
import MyComponent from './MyComponent'
import '../../styles/Chat.css'

class VideoChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      peers: []
    }
  }

  join = webrtc => webrtc.joinRoom('video-chat-room-arbitrary-name')

  handleCreatedPeer = (webrtc, peer) => {
    this.setState({peers: [...this.state.peers, peer]})
  }

  handleRemovedPeer = () => {
    this.setState({peers: this.state.peers.filter(p => !p.closed)})
  }

  generateRemotes = () =>
    this.state.peers.map(peer => (
      <RemoteVideo key={`remote-video-${peer.id}`} peer={peer} />
    ))

  render() {
    return (
      <iframe
        src="http://www.bombmanual.com/manual/1/html/index.html"
        className="iframe"
      >
        <LioWebRTC
          options={{
            debug: true,
            media: {
              video: false,
              audio: true
            }
          }}
          onReady={this.join}
          onCreatedPeer={this.handleCreatedPeer}
          onRemovedPeer={this.handleRemovedPeer}
        >
          <LocalVideo />
          {this.state.peers && this.generateRemotes()}
        </LioWebRTC>
      </iframe>
    )
  }
}

export default VideoChat
