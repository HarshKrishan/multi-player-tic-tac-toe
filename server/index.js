const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //   console.log("a user connected with id:", socket.id);

  socket.on("joinRoom", ({ name, room }) => {
    // Check if the room exists and if there's at least one player in it
    if (
      !io.sockets.adapter.rooms.has(room) ||
      io.sockets.adapter.rooms.get(room).size === 0
    ) {
      // Emit an event to notify the client that the room doesn't exist or is empty
      socket.emit("roomNotFound");
      return;
    }
    // console.log("joined room", room);
    socket.join(room);
    socket.to(room).emit("opponent joined");
  });
  socket.on("createRoom", ({ name, room }) => {
    console.log("created room", room);
    socket.join(room);
  });

  socket.on("move", (data) => {
    // console.log("move",data);
    socket.to(data.room).emit("move", data);
  });

  socket.on("winner", (data) => {
    // console.log("winner",data);
    socket.to(data.room).emit("winner", data);
  });

  socket.on("reset", (data) => {
    // console.log("reset",data);
    socket.to(data.room).emit("reset", data);
  });

  socket.on("disconnect", () => {
    // rooms = [];
    // console.log("user disconnected");
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`listening on port:${port}`);
});
