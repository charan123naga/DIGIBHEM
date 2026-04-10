import React from "react";

function ColorPicker({ setColor }) {
  return <input type="color" onChange={(e) => setColor(e.target.value)} />;
}

export default ColorPicker;
