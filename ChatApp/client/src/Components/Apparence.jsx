import '../styles/Settings.css';
import { useState } from 'react';


const Apperance = () => {
    const [fontSize, setFontSize] = useState(16);

    return (
        <div className="apperance-container">
            <h1>Apparence</h1>
            <p>Customize the appearance of your application.</p>
            <div className="apperance-options">
                <div className="option">
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="option fontsize">
                    <div className='left'>
                        <label htmlFor="font-size">Font Size:</label>
                        <input type="range" id="font-size" min="12" max="96" step={4} value={fontSize} onChange={(e)=>setFontSize(e.target.value)} />
                    </div>
                    <div className='right'>
                        <input type="number" id="font-size-value" min="12" max="96" value={fontSize} onChange={(e)=>setFontSize(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="apperance-actions">
                <button className="save-button">Save Changes</button>
                <button className="reset-button">Reset to Default</button>
            </div>
        </div>
    )
}

export default Apperance;