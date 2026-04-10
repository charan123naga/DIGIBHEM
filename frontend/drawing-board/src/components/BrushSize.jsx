import React from "react";

function BrushSize({ brushSize, setBrushSize }) {
  return (
    <input
      type="range"
      min="1"
      max="20"
      value={brushSize}
      onChange={(e) => setBrushSize(e.target.value)}
    />
  );
}

export default BrushSize;
