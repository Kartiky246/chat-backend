import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import http from "http";
import connectDB from "./database/connectDB.js";
import { app } from "./app.js";
import { Server } from "socket.io";

const server = http.createServer(app);
const socketIO = require('socket.io');

const io = socketIO(server,{
  cors: {
    origin: "*",
    credentials:true,    
    optionSuccessStatus:200,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Joined", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.participants) console.log("participants are not there");
    chat.participants.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
