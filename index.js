const express = require("express");

// App setup
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static('frontend'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
    socket.on('new order', (data) => {
        io.emit('new order', data);
    });
    socket.on('delete order', () => {
        io.emit('delete order');
    })
});

server.listen(6500, () => {
    console.log('listening on *:6500');
});

console.log('NOTE: Press Ctrl + C to stop server.');