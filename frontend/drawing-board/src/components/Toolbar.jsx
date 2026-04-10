import React from "react";
import SaveLoad from "./SaveLoad";

function Toolbar({
  setColor,
  brushSize,
  setBrushSize,
  setTool,
  clearCanvas,
  canvasRef,
}) {
  return (
    <div className="toolbar">
      <button onClick={() => setTool("pencil")}>✏️ Pencil</button>

      <button onClick={() => setTool("eraser")}>🧽 Eraser</button>

      <div className="tool-item">
        🎯 Color
        <input type="color" onChange={(e) => setColor(e.target.value)} />
      </div>

      <div className="tool-item">
        📏 Size
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </div>

      <button onClick={clearCanvas}>🧹 Clear</button>

      <SaveLoad canvasRef={canvasRef} />
    </div>
  );
}

export default Toolbar;
