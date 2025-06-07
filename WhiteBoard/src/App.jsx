import { useState } from "react";
import ToolBar from "./Components/ToolBar";
import Canvas from "./Components/Canvas";

function App() {

  const [mode, setMode] = useState("freehand");
  return (
    <div className="App">
      <ToolBar setMode={setMode}/>
      <Canvas mode={mode} />
    <footer className="footer">
      <p>© 2024 WhiteBoard. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default App;