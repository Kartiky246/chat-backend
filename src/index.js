import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import http from "http";
import connectDB from "./database/connectDB.js";
import { app } from "./app.js";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("setup", (_id) => {
    socket.join(_id);
    console.log(_id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessage) => {
    let chat = newMessage.data;

    if (!chat.participants) console.log("participants are not there");
    chat.participants.forEach((user) => {
      // if (user === chat.sender) return;
      socket.in(user).emit("message received", newMessage);
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
