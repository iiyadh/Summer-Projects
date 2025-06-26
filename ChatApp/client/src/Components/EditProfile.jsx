import { useState } from 'react';
import '../styles/Settings.css';
import Popup from './common/Popup';
const EditProfile = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [clickSpot, setClickSpot] = useState({ x: 0, y: 0 });

    const handleOpenPopup = (e) => {
        setClickSpot({x:e.clientX, y:e.clientY});
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
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e)}>Edit</button>
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
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e)}>Edit</button>
                    </div>

                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Bio</label>
                            <div className="field-value placeholder">You haven't added a biography yet.</div>
                        </div>
                        <button className="field-btn" onClick={(e)=>handleOpenPopup(e)}>Edit</button>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="password-section">
                <h3 className="section-title">Password and Authentication</h3>
                <button className="change-password-btn" onClick={(e)=>handleOpenPopup(e)}>Change Password</button>
            </div>
        </div>
            {isPopupOpen && <Popup onClose={() => setIsPopupOpen(false)} spot={clickSpot}>Hello!</Popup>}
        </>
    )
}

export default EditProfile;