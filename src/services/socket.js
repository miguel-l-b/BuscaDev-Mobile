import socketio from 'socket.io-client'

const socket = socketio('https://api-devbusca.herokuapp.com', {
    autoConnect: false,
})

function ConnectSocket() {
    socket.connect()
}

function DisconnectSocket() {
    if (socket.connected) {
        socket.disconnect()
    }
}

export {
    ConnectSocket,
    DisconnectSocket,
}