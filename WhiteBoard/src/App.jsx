import { useState } from "react";
import ToolBar from "./Components/ToolBar";
import Canvas from "./Components/Canvas";

function App() {
  const [mode, setMode] = useState("freehand");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  return (
    <div className="App">
      <ToolBar setMode={setMode} color={color} setColor={setColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
      <Canvas mode={mode} color={color} strokeWidth={strokeWidth} />
      <footer className="footer">
        <p>© 2025 WhiteBoard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;