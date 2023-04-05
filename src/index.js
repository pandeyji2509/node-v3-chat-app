const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express();
const Filter=require('bad-words');
const { rejects } = require('assert');
const server = http.createServer(app)
const io = new socketio.Server();
const {generateMessage,generateLocationMessage}=require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users');

io.attach(server)
 
const port = process.env.PORT || 3001

app.use(express.static("public"))
//let count=0;
//io is used o broadcat to everyone
//
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('roomData',({room,users})=>{
        console.log(room);
        console.log(users);
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})