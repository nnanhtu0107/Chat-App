import express from "express";
import path from "path";
import http from "http";
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const { Users } = require("./utils/users");

require("dotenv").config();

const pathPublic = path.join(__dirname, "../public");
const socketIO = require("socket.io");
const port = process.env.PORT || 1234;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(pathPublic));
io.on("connection", (socket) => {
  console.log("A new user just connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room are required");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    console.log(users);
    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welocome to ${params.room}!`)
    );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", "New User Joined!"));

    callback();
  });

  socket.on("createMessage", (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
    callback("This is the server:");
  });

  socket.on("createLocationMessage", (coords) => {
    let user = users.getUser(socket.id);
    
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.lat, coords.lng)
      );
    }
  });

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage(
          "Admin",
          `${user.name} has left ${user.room} chat room.`
        )
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
