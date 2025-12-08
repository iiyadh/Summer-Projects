import { useState } from 'react';
import '../styles/Settings.css';
import EditUsername from './PopupContent/EditUsername';
import EditEmail from './PopupContent/EditEmail';
import EditBio from './PopupContent/EditBio';
import EditPassword from './PopupContent/EditPassword';
import { Button, Modal, Popconfirm } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';


const EditProfile = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activePopUp, setActivePopUp] = useState('');

    const handleOpenPopup = (e,pop) => {
        setActivePopUp(pop);
        setIsPopupOpen(true);
    }


    const handleCancel = () => {
        setIsPopupOpen(false);
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
                </div>

                {/* Profile Fields */}
                <div className="profile-fields">
                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Username</label>
                            <div className="field-value">thedoctor2367</div>
                        </div>
                        <Button className="field-btn" onClick={(e)=>handleOpenPopup(e,"editUsername")}>Edit</Button>
                    </div>

                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Email</label>
                            <div className="email-section">
                                <span className="field-value">{showEmail ? "thedoctor2367@gmail.com" : "************@gmail.com"}</span>
                                <Button className="reveal-btn" onClick={() => setShowEmail(!showEmail)}>
                                    <span className="eye-icon">{showEmail ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
                                    {showEmail ? "Hide" : "Reveal"}
                                </Button>
                            </div>
                        </div>
                            <Popconfirm
                                title="Change E-mail"
                                description="Are you sure you want to change your E-mail?"
                                onCancel={handleCancel}
                                onConfirm={(e) => handleOpenPopup(e, "editEmail")}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className="field-btn">Edit</Button>
                            </Popconfirm>
                    </div>

                    <div className="field-group">
                        <div className="field-content">
                            <label className="field-label">Bio</label>
                            <div className="field-value placeholder">You haven't added a biography yet.</div>
                        </div>
                        <Button className="field-btn" onClick={(e)=>handleOpenPopup(e,"editBio")}>Edit</Button>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="password-section">
                <h3 className="section-title">Password and Authentication</h3>
                <Button className="change-password-btn" onClick={(e)=>handleOpenPopup(e,"changePassword")}>Change Password</Button>
            </div>
        </div>
            <Modal
                title="Basic Modal"
                footer={null}
                open={isPopupOpen}
                onCancel={handleCancel}
            >
                {activePopUp === 'editUsername' && <EditUsername />}
                {activePopUp === 'editEmail' && <EditEmail />}
                {activePopUp === 'editBio' && <EditBio />}
                {activePopUp === 'changePassword' && <EditPassword />}
            </Modal>
        </>
    )
}

export default EditProfile;