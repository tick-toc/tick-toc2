import {Provider} from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import * as Swrtc from '@andyet/simplewebrtc'

// ====================================================================
// IMPORTANT SETUP
// ====================================================================
// Replace `YOUR_API_KEY` here with the API key you received when
// signing up for SimpleWebRTC
// --------------------------------------------------------------------
const API_KEY = 'YOUR_API_KEY'
// ====================================================================

const ROOM_NAME = 'a5688f9bc9876485713d3927'
const ROOM_PASSWORD = 'YOUR_ROOM_PASSWORD'
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`

const store = Swrtc.createStore()

ReactDOM.render(
  <Provider store={store}>
    <Swrtc.Provider configUrl={CONFIG_URL}>
      {/* Render based on the connection state */}
      <Swrtc.Connecting>
        <h1>Connecting...</h1>
      </Swrtc.Connecting>

      <Swrtc.Connected>
        <h1>Connected!</h1>
        {/* Request the user's media */}
        <Swrtc.RequestUserMedia audio video auto />

        {/* Connect to a room with a name and optional password */}
        <Swrtc.Room name={ROOM_NAME} password={ROOM_PASSWORD}>
          {props => {
            /* Use the rest of the Swrtc React Components to render your UI */
          }}
        </Swrtc.Room>
      </Swrtc.Connected>
    </Swrtc.Provider>
  </Provider>,
  document.getElementById('app')
)
