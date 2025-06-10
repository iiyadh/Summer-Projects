import { useState, useRef } from "react";
import ToolBar from "./Components/ToolBar";
import Canvas from "./Components/Canvas";

function App() {
  const [mode, setMode] = useState("freehand");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const canvasRef = useRef(null);
  
  const handleClear = () => {
    if (canvasRef.current && window.confirm("Are you sure you want to clear the canvas? This action cannot be undone.")) {
      canvasRef.current.clearCanvas();
    }
  };
  
  const handleSave = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvasRef.current.getCanvasImage();
      link.click();
    }
  };
  
  return (
    <div className="App">
      <ToolBar 
        setMode={setMode} 
        color={color} 
        setColor={setColor} 
        strokeWidth={strokeWidth} 
        setStrokeWidth={setStrokeWidth}
        onClear={handleClear}
        onSave={handleSave}
      />
      <Canvas 
        ref={canvasRef} 
        mode={mode} 
        color={color} 
        strokeWidth={strokeWidth} 
      />
      <footer className="footer">
        <p>© 2025 WhiteBoard All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;