import createClientSocket from 'socket.io-client'

const clientSocket = createClientSocket(window.location.origin)

clientSocket.on('connect', () => {
  console.log('Connected!')
})

export default socket
