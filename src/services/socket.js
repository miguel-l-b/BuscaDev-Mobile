import socketio from 'socket.io-client'

const socket = socketio('https://api-devbusca.herokuapp.com', {
    autoConnect: false,
})

function subscribeToNewDevs(subcribeFunction) {
    socket.on('new-dev', subcribeFunction)
}

function ConnectSocket(longitude, latitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    }
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
    subscribeToNewDevs,
}