import createClientSocket from 'socket.io-client'

const clientSocket = createClientSocket(window.location.origin)

// what is this? window.location.origin
//

clientSocket.on('connect', () => {
  console.log('Connected!')
})

// window.addEventListener()

export default clientSocket
