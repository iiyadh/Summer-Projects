import { Link } from 'react-router-dom';
import '../styles/Settings.css';

const SettingsMenu = () => {
    return (
        <div className="settings-menu">
            <div className="topSection">
                <h2>Settings</h2>
                <ul>
                    <li><Link to="/settings/profile">Profile</Link></li>
                    <li><Link to="/settings/apparence">Apparence</Link></li>
                    <li><Link to="/settings/language">Language</Link></li>
                </ul>
            </div>
            <div className="bottomSection">
                <button>Logout</button>
            </div>
        </div>
    );
}

export default SettingsMenu;