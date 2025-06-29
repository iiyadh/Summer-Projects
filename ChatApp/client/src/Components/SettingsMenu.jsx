import { Link } from 'react-router-dom';
import '../styles/Settings.css';

const SettingsMenu = () => {
    return (
        <div className="settings-menu">
            <div className="topSection">
                <div className='topSectionHeader'>
                    <Link to="/chat" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <h2>Settings</h2>
                </div>
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