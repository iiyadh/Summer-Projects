import { useState } from 'react';
import '../styles/Settings.css';
import Popup from './common/Popup';
import EditUsername from './PopupContent/EditUsername';
// import EditEmail from './PopupContent/EditEmail';
// import EditBio from './PopupContent/EditBio';
// import EditPassword from './PopupContent/EditPassword';


const EditProfile = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activePopUp, setActivePopUp] = useState('');
    const [clickSpot, setClickSpot] = useState({ x: 0, y: 0 });

    const handleOpenPopup = (e,pop) => {
        setClickSpot({x:e.clientX, y:e.clientY});
        setActivePopUp(pop);
        setIsPopupOpen(true);
    }

    return (
        <>
        <div className="profile-container">
            <div className="profile-card">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="avatar-container">
                            <div className="avatar">
                                <div className="avatar-placeholder">TD</div>
                            </div>
                            <button className="avatar-add-btn">
                                <span className="plus-icon">+</span>
                            </button>
                        </div>
                        <div className="user-details">
                            <div className="username-section">
                                <h2 className="username">The Doctor</h2>
                            </div>
                        </div>
                    </div>
                    {/* <button className="edit-profile-btn">Edit User Profile</button> */}
                </div>

                {/* Profile Fields */}
                <div className="profile-fields">
                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Username</label>
                            <div className="field-value">thedoctor2367</div>
                        </div>
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e,"editUsername")}>Edit</button>
                    </div>

                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Email</label>
                            <div className="email-section">
                                <span className="field-value">{showEmail ? "thedoctor2367@gmail.com" : "************@gmail.com"}</span>
                                <button className="reveal-btn" onClick={() => setShowEmail(!showEmail)}>
                                    <span className="eye-icon">{showEmail ? "👁️‍🗨️" : "👁️"}</span>
                                    {showEmail ? "Hide" : "Reveal"}
                                </button>
                            </div>
                        </div>
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e,"editEmail")}>Edit</button>
                    </div>

                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Bio</label>
                            <div className="field-value placeholder">You haven't added a biography yet.</div>
                        </div>
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e,"editBio")}>Edit</button>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="password-section">
                <h3 className="section-title">Password and Authentication</h3>
                <button className="change-password-btn" onClick={(e)=>handleOpenPopup(e,"changePassword")}>Change Password</button>
            </div>
        </div>
            {isPopupOpen && <Popup onClose={() => setIsPopupOpen(false)} spot={clickSpot}>
                {activePopUp === 'editUsername' && <EditUsername />}
                {activePopUp === 'editEmail' && <EditEmail />}
                {activePopUp === 'editBio' && <EditBio />}
                {activePopUp === 'changePassword' && <EditPassword />}
            </Popup>}
        </>
    )
}

export default EditProfile;