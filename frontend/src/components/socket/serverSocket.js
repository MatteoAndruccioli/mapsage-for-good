import io from 'socket.io-client'

var socket = io('http://localhost:3000')
console.log("opening socket...")

export function openSocket() {
  if (socket.disconnected) {
    socket = io('http://localhost:3000')
    console.log("opening socket... (inside openSocket())")
  }
  return socket
}

export function closeSocket() {
  if (socket.connected) {
    console.log("closing socket...")
    socket.close()
  }
}
