const io = require('socket.io');
const getPort = require('get-port');
const {EventEmitter} = require('events');

class SocketServer {
    constructor() {
        this.socketServer = io();
        this.connectionEmitter = new EventEmitter();
    }

    async start() {
        this.registerDefaultHandlers();
        const PORT = await getPort();
        this.socketServer.listen(PORT);
        console.log(`[IO] server listening on ${PORT}`);
        return PORT;
    }

    registerDefaultHandlers() {
        this.socketServer.on('connection', (socket) => {
            this.connectionEmitter.emit('connect', socket);
            socket.on('disconnect', () => {
                this.connectionEmitter.emit('disconnect', socket);
            });
        });
    }

    onNewConnection(cb) {
        this.connectionEmitter.on('connect', (socket) => {
            console.log(`[IO] connect: ${socket.id}`);
            cb(socket.id);
        });
    }

    onDisconnect(cb) {
        this.connectionEmitter.on('disconnect', (socket) => {
            console.log(`[IO] disconnect: ${socket.id}`);
            cb(socket.id);
        });
    }

    on(id, event, cb) {
        if (this.hasId(id)) {
            console.log(`[IO] register: ${event} @ ${id}`);
            this.getSocket(id).on(event, (data) => {
                cb(data);
            });
        } else {
            throw new Error('socket does not exist!');
        }
    }

    emit(id, event, data) {
        if (this.hasId(id)) {
            console.log(`[IO] emit: ${event} @ ${id}`);
            this.getSocket(id).emit(event, data);
        } else {
            throw new Error('socket does not exist!');
        }
    }

    getSocket(id) {
        return this.socketServer.of("/").sockets.get(id);
    }

    hasId(id) {
        return this.socketServer.of("/").sockets.has(id);
    }
}

module.exports = {SocketServer};
