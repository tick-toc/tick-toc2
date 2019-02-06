import React, {Component} from 'react'
import './ChatApp.css'
import ChatBox from './ChatBox'
import {LioWebRTC} from 'react-liowebrtc'

class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatLog: [],
      options: {
        debug: true,
        media: {
          video: true,
          audio: true
        }
      }
    }
  }

  addChat = (name, message, alert = false) => {
    this.setState({
      chatLog: this.state.chatLog.concat({
        name,
        message: `${message}`,
        timestamp: `${Date.now()}`,
        alert
      })
    })
  }

  join = webrtc => {
    webrtc.joinRoom('my-p2p-app-demo')
  }

  handlePeerData = (webrtc, type, payload, peer) => {
    switch (type) {
      case 'chat':
        this.addChat(`Peer-${peer.id.substring(0, 5)}`, payload)
        break
      default:
    }
  }

  render() {
    const {chatLog} = this.state
    return (
      <div className="App">
        <LioWebRTC
          options={this.state.options}
          onReady={this.join}
          onCreatedPeer={this.handleCreatedPeer}
          onReceivedPeerData={this.handlePeerData}
        >
          <ChatBox
            chatLog={chatLog}
            onSend={msg => msg && this.addChat('Me', msg)}
          />
        </LioWebRTC>
      </div>
    )
  }
}

export default ChatApp
