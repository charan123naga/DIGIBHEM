import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import "../styles/DrawingBoard.css";
import { io } from "socket.io-client";

// ✅ Create socket OUTSIDE component
const socket = io("https://your-backend-url.onrender.com");

function DrawingBoard() {
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pencil");

  // ✅ Local clear (no emit)
  const clearCanvasLocal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ✅ Sync with server
  useEffect(() => {
    socket.on("draw", (data) => {
      const ctx = canvasRef.current.getContext("2d");

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;

      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    socket.on("clear", () => {
      clearCanvasLocal(); // ✅ FIXED
    });

    return () => {
      socket.off("draw");
      socket.off("clear");
    };
  }, []);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setDrawing(true);
  };

  const stopDrawing = () => {
    setDrawing(false);

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

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

    // ✅ SEND TO SERVER
    socket.emit("draw", {
      x,
      y,
      color: tool === "eraser" ? "white" : color,
      brushSize,
    });
  };

  // ✅ Emit clear event
  const clearCanvas = () => {
    clearCanvasLocal();
    socket.emit("clear");
  };

  return (
    <div className="board-container">
      <h1 className="title">🎨 Online Drawing Board</h1>

      <Toolbar
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        setTool={setTool}
        clearCanvas={clearCanvas}
        canvasRef={canvasRef}
      />

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width="900"
          height="500"
          className="canvas"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
        />
      </div>
    </div>
  );
}

export default DrawingBoard;
