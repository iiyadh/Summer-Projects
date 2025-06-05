import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faEraser, 
  faSlash, 
  faSquare, 
  faCircle,
  faFont 
} from '@fortawesome/free-solid-svg-icons';

const ToolBar = ({setMode}) => {
  return (
    <div className="toolbar">
      <button className="tool-button" title="Freehand" onClick={() => setMode("freehand")}>
        <FontAwesomeIcon icon={faPen} className="tool-icon" />
        <span>Freehand</span>
      </button>
      <button className="tool-button" title="Eraser" onClick={() => setMode("eraser")}>
        <FontAwesomeIcon icon={faEraser} className="tool-icon" />
        <span>Eraser</span>
      </button>
      <button className="tool-button" title="Line" onClick={() => setMode("line")}>
        <FontAwesomeIcon icon={faSlash} className="tool-icon" />
        <span>Line</span>
      </button>
      <button className="tool-button" title="Rectangle" onClick={() => setMode("rectangle")}>
        <FontAwesomeIcon icon={faSquare} className="tool-icon" />
        <span>Rectangle</span>
      </button>
      <button className="tool-button" title="Ellipse" onClick={() => setMode("ellipse")}>
        <FontAwesomeIcon icon={faCircle} className="tool-icon" />
        <span>Ellipse</span>
      </button>
      <button className="tool-button" title="Text" onClick={() => setMode("text")}>
        <FontAwesomeIcon icon={faFont} className="tool-icon" />
        <span>Text</span>
      </button>
    </div>
  );
}

export default ToolBar;