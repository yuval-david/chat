const express = require('express');
const app = express();
const http = require('http'); // to build our server together with socket.io
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

// Generate the server for us
const server = http.createServer(app);

// Connection between socket.io to our server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //The server which server will be calling (react)
        methods: ["GET", "POST"], //Which methods we except for
    },
});


io.on("connection", (socket) => {
    console.log("User connected", socket.id);


    socket.on("join_room", (data) => {
        socket.join(data); //room from front
        //console.log(`User with ID: ${socket.id} joined room: ${data.room}.`);
    });

    socket.on("send_message", (data) => {
        console.log(data); //Message Data
        socket.to(data.room).emit("receive_message", data); //data.room = room ID
    });

    socket.on("disconnect", (data) => {
        console.log("User disconnected", socket.id);
        socket.leave(data);
        socket.to(data).emit('user_left', socket.id);
    });
});



server.listen(3001, () => {
    console.log("SERVER RUNNING");
});