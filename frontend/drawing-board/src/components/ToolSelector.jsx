import React from "react";

function ToolSelector({ setTool }) {
  return (
    <div className="tool-group">
      <button onClick={() => setTool("pencil")}>✏️ Pencil</button>

      <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
    </div>
  );
}

export default ToolSelector;
