// NODE.JS Mini Server for Website - CA4
// Supplied as part of Assignment Setup Instructions
// Not my own code unless explicitly marked.

const express = require("express");
const socket = require("socket.io");

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

// Static files
/*
app.use(express.static("frontend"));

// Page Not Found Handling
app.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});

// Socket setup
const io = socket(server);
*/

/*io.on("connection", function (socket) {
    console.log("Made socket connection");

    /*socket.on("new user", function (data) {
        socket.userId = data;

        activeUsers.add(data);
        //... is the the spread operator, adds to the set while retaining what was in there already
        io.emit("new user", [...activeUsers]);
    });

    socket.on("disconnect", function () {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });*/

    /*socket.on("new order", function (data) {
        io.emit("new order", data);
    });

});*/