import { useEffect, useRef, useState } from "react";
import "../App.scss";

const Canvas = ({ mode, color, strokeWidth }) => {
  const canvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [textFont, setTextFont] = useState("16px Arial");
  const [textColor, setTextColor] = useState(color);

  useEffect(() => {
    setTextColor(color);
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Set main canvas dimensions
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set background canvas dimensions and position
      bgCanvas.width = rect.width;
      bgCanvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "text") {
      setTextPos({ x, y });
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });

    const ctx = canvas.getContext("2d");
    
    // Setup for drawing with proper styling
    ctx.strokeStyle = mode === "eraser" ? "white" : color;
    ctx.lineWidth = mode === "eraser" ? 20 : strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // For freehand and eraser, start the path
    if (mode === "freehand" || mode === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing || mode === "text") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");

    if (mode === "freehand" || mode === "eraser") {
      // Continue drawing the freehand path
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // For shapes, draw on temporary canvas during mouse move
      const bgCanvas = backgroundCanvasRef.current;
      const bgCtx = bgCanvas.getContext("2d");
      
      // Clear previous preview
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      // Set same style as main canvas
      bgCtx.strokeStyle = color;
      bgCtx.lineWidth = strokeWidth;
      bgCtx.lineCap = "round";
      bgCtx.lineJoin = "round";
      
      if (mode === "line") {
        bgCtx.beginPath();
        bgCtx.moveTo(startPos.x, startPos.y);
        bgCtx.lineTo(x, y);
        bgCtx.stroke();
      } else if (mode === "rectangle") {
        bgCtx.beginPath();
        bgCtx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
        bgCtx.stroke();
      } else if (mode === "ellipse") {
        bgCtx.beginPath();
        const radiusX = Math.abs(x - startPos.x) / 2;
        const radiusY = Math.abs(y - startPos.y) / 2;
        const centerX = startPos.x + (x - startPos.x) / 2;
        const centerY = startPos.y + (y - startPos.y) / 2;
        
        bgCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        bgCtx.stroke();
      }
    }
  };

  const endDrawing = (e) => {
    if (!isDrawing || mode === "text") return;

    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    
    // Only for shape tools
    if (mode !== "freehand" && mode !== "eraser") {
      // Clear temp canvas
      const bgCtx = bgCanvas.getContext("2d");
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      // Draw final shape on main canvas
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      if (mode === "line") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (mode === "rectangle") {
        ctx.beginPath();
        ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
        ctx.stroke();
      } else if (mode === "ellipse") {
        ctx.beginPath();
        const radiusX = Math.abs(x - startPos.x) / 2;
        const radiusY = Math.abs(y - startPos.y) / 2;
        const centerX = startPos.x + (x - startPos.x) / 2;
        const centerY = startPos.y + (y - startPos.y) / 2;
        
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    setIsDrawing(false);
  };

  const handleFontSizeChange = (e) => {
    const fontSize = e.target.value;
    setTextFont(`${fontSize}px Arial`);
  };

  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = textFont;
    ctx.fillStyle = textColor;
    ctx.fillText(textInput, textPos.x, textPos.y);
    
    setTextInput("");
    setShowTextInput(false);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        id="PaintingCanvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      
      <canvas
        ref={backgroundCanvasRef}
        id="TempCanvas"
        className="temp-canvas"
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>

      {showTextInput && (
        <div className="text-input-modal">
          <div className="text-input-container">
            <div className="text-input-controls">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                title="Text Color"
                className="text-color-picker"
              />
              <select 
                onChange={handleFontSizeChange}
                className="font-size-selector"
                defaultValue="16"
              >
                <option value="12">12px</option>
                <option value="16">16px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
                <option value="32">32px</option>
              </select>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && addText()}
              placeholder="Type your text here..."
              autoFocus
              className="text-input-field"
            />
            <div className="text-input-buttons">
              <button onClick={() => setShowTextInput(false)} className="cancel-button">Cancel</button>
              <button onClick={addText} className="add-button">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;