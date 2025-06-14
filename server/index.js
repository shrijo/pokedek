import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const experiences = {}; // simple in‑memory storage

io.on("connection", (socket) => {
  let room = null;

  socket.on("join", ({ experienceId, userId }) => {
    room = experienceId;
    socket.join(room);

    if (!experiences[room]) experiences[room] = { squares: {} };
    if (!experiences[room].squares[userId]) {
      experiences[room].squares[userId] = { x: 50, y: 50, color: randomColor() };
    }

    io.to(room).emit("state", experiences[room].squares);
  });

  socket.on("move", ({ userId, dx, dy }) => {
    if (!room) return;
    const square = experiences[room]?.squares?.[userId];
    if (square) {
      square.x += dx;
      square.y += dy;
      io.to(room).emit("state", experiences[room].squares);
    }
  });
});

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Socket server running on ${PORT}`));
