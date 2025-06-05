import { useState } from "react";
import ToolBar from "./Components/ToolBar";
import Canvas from "./Components/Canvas";

function App() {

  const [mode, setMode] = useState("freehand");
  return (
    <div className="App">
      <ToolBar setMode={setMode}/>
      <Canvas mode={mode} />
    </div>
  );
}

export default App;