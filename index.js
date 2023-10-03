const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

app.get('/' , (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


io.on('connection' , (socket) => {

    //broadcasting a message when some one is on the chat
    io.emit('user connected' , 'a user has connected')

    socket.on('set nickname', (nickname) => {
        socket.nickname = nickname; // Store the nickname in the socket object
      });

    socket.on('chat message' , (data) => {
        io.emit('chat message' , { nickname: socket.nickname, message: data.message });
    })

    socket.on('disconnect' , () => {
        io.emit('disconnected' , 'a user has disconnected');
    })

    socket.on('typing' , (isTyping) => {
        socket.broadcast.emit('typing' , isTyping);
    })
})


server.listen(2000 , () => {
    console.log('server running');
})