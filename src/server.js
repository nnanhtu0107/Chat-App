import express from "express";
import path from "path";
import http from "http";
import {
  generateMessage,
  generateLocationMessage,
} from "./server/utils/message";
require("dotenv").config();

const pathPublic = path.join(__dirname, "/public");
const socketIO = require("socket.io");
const port = process.env.PORT || 1234;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(pathPublic));

io.on("connection", (socket) => {
  console.log("A news user just connected");

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app!")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New User Joined!")
  );

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("This is the server!");
  });
  socket.on("createLocationMessage", (coords) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.lat, coords.lng)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port:  ${port}`);
});
