import { useEffect, useRef, useState } from "react";
import "../App.scss";

const Canvas = ({ mode }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
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
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = mode === "eraser" ? "white" : "black";
    ctx.lineWidth = mode === "eraser" ? 20 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e) => {
    if (!isDrawing || mode === "text") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");

    if (mode === "freehand" || mode === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = (e) => {
    if (!isDrawing || mode === "text") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");

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

    setIsDrawing(false);
  };

  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
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

      {showTextInput && (
        <div
          className="text-input-modal"
          style={{
            position: "absolute",
            left: `${textPos.x}px`,
            top: `${textPos.y}px`,
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addText()}
            autoFocus
          />
          <button onClick={addText}>Add</button>
        </div>
      )}
    </div>
  );
};

export default Canvas;