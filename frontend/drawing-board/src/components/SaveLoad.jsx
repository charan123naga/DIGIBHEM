import React from "react";

function SaveLoad({ canvasRef }) {
  const saveDrawing = () => {
    const canvas = canvasRef.current;

    const dataURL = canvas.toDataURL();

    localStorage.setItem("drawing", dataURL);

    alert("Drawing Saved!");
  };

  const loadDrawing = () => {
    const savedData = localStorage.getItem("drawing");

    if (!savedData) {
      alert("No saved drawing found");
      return;
    }

    const img = new Image();
    img.src = savedData;

    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.drawImage(img, 0, 0);
    };
  };

  return (
    <div className="save-load">
      <button onClick={saveDrawing}>💾 Save</button>

      <button onClick={loadDrawing}>📂 Load</button>
    </div>
  );
}

export default SaveLoad;
