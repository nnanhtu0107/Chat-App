import express from "express";

const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const pathPublic = path.join(__dirname, "/public");
const port = process.env.PORT || 1234;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(pathPublic));

io.on("connection", (socket) => {
  console.log("A news user just connected");

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app!",
    createAt: new Date().getTime(),
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New User Joined!",
    createAt: new Date().getTime(),
  });

  socket.on("CreateMessage", (message) => {
    console.log("CreateMessage", message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createAt: new Date().getTime(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port:  ${port}`);
});
