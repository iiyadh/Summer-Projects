import SettingsMenu from "../Components/SettingsMenu";
import '../styles/Settings.css';
import { Outlet } from 'react-router-dom';

const Settings = () =>{
    return(
        <div className="settings-container">
            <SettingsMenu />
            <Outlet />
        </div>
    )
}

export default Settings;