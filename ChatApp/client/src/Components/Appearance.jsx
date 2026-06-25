import '../styles/Settings.css';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chatapp-appearance';

const Appearance = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { theme: 'light', fontSize: 16 };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.fontSize = `${settings.fontSize}px`;
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetToDefault = () => {
        setSettings({ theme: 'light', fontSize: 16 });
    };

    return (
        <div className="appearance-container">
            <h1>Appearance</h1>
            <p>Customize the appearance of your application.</p>
            <div className="appearance-options">
                <div className="option">
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" value={settings.theme} onChange={(e) => updateSetting('theme', e.target.value)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="option fontsize">
                    <div className='left'>
                        <label htmlFor="font-size">Font Size:</label>
                        <input type="range" id="font-size" min="12" max="96" step={4} value={settings.fontSize} onChange={(e) => updateSetting('fontSize', Number(e.target.value))} />
                    </div>
                    <div className='right'>
                        <input type="number" id="font-size-value" min="12" max="96" value={settings.fontSize} onChange={(e) => updateSetting('fontSize', Number(e.target.value))} />
                    </div>
                </div>
            </div>
            <div className="appearance-actions">
                <button className="save-button" onClick={() => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))}>Save Changes</button>
                <button className="reset-button" onClick={resetToDefault}>Reset to Default</button>
            </div>
        </div>
    )
}

export default Appearance;
