import LioWebRTC from 'liowebrtc'

const webrtc = new LioWebRTC({
  autoRequestMedia: true,
  media: {
    video: false,
    audio: true
  }
})
