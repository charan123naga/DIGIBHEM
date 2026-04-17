const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const draw = (e) => {
  if (!drawing) return;

  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;

  const ctx = canvasRef.current.getContext("2d");

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = tool === "eraser" ? "white" : color;

  ctx.lineTo(x, y);
  ctx.stroke();

  // Send data to server
  socket.emit("draw", {
    x,
    y,
    color,
    brushSize,
  });
};

// Socket.IO setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // or your Vercel URL
    methods: ["GET", "POST"],
  },
});

// Store drawing data (temporary)
let drawingData = [];

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing drawing to new user
  socket.emit("loadDrawing", drawingData);

  // Receive drawing from client
  socket.on("draw", (data) => {
    drawingData.push(data);

    // Send to all users
    socket.broadcast.emit("draw", data);
  });

  // Clear canvas
  socket.on("clear", () => {
    drawingData = [];
    io.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
