import React, { useRef, useState, useEffect } from "react";
import socket from "../services/socket";

function CanvasBoard({ color, brushSize, tool }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    socket.on("draw-data", (data) => {
      const ctx = canvasRef.current.getContext("2d");

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.size;

      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });
  }, []);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setDrawing(true);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    ctx.strokeStyle = tool === "eraser" ? "white" : color;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("draw-data", {
      x,
      y,
      color,
      size: brushSize,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width="900"
      height="500"
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      className="canvas"
    />
  );
}

export default CanvasBoard;
