import { useEffect, useState } from 'react';
import '../styles/Settings.css';
import EditUsername from './PopupContent/EditUsername';
import EditEmail from './PopupContent/EditEmail';
import EditBio from './PopupContent/EditBio';
import EditPassword from './PopupContent/EditPassword';
import { Button, Modal, Popconfirm, Upload, Avatar } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';
import ImgCrop from "antd-img-crop";
import { uploadToCloudinary } from '../lib/cloudinary';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

const EditProfile = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activePopUp, setActivePopUp] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const { getUserProfile, updateProfilePicture ,  sendOTPCodeToEmail} = useUserStore();


    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfile();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    },[]);

    const handleOpenPopup = async (e, pop) => {
        e.preventDefault();
        if (pop === 'editEmail') {
            try{
                await sendOTPCodeToEmail();
                toast.success('OTP code sent to your email.');
            }catch(err){
                console.log(err);
                toast.error('Failed to send OTP code to email. Please try again later.');
                return;
            }
        }
        setActivePopUp(pop);
        setIsPopupOpen(true);
    }

    const handleCancel = () => {
        setIsPopupOpen(false);
    }

    // Convert file to base64 for preview
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleUploadChange = async (info) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done' || info.file.originFileObj) {
            const base64 = await getBase64(info.file.originFileObj || info.file);
            setAvatarUrl(base64);
            setUploading(false);
        }
    };

    // Custom request to handle upload without actual server call
    const customRequest = async ({ file, onSuccess }) => {
        try{
            const data = await uploadToCloudinary(file);
            await updateProfilePicture(data.url);
            setUserInfo(prev => ({ ...prev, profilePicture: data.url }));
            onSuccess("ok");
        }catch(err){
            console.error('Upload failed:', err);
        }
    };

    // Validate file before upload
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            console.error('You can only upload image files!');
            return false;
        }
        
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            console.error('Image must be smaller than 5MB!');
            return false;
        }
        
        return true;
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    {/* Header Section */}
                    <div className="profile-header">
                        <div className="profile-info">
                            <div className="avatar-container">
                                <div className="avatar">
                                    <Avatar
                                        size={70}
                                        src={userInfo.profilePicture || avatarUrl}
                                        icon={!userInfo?.profilePicture && <UserOutlined />}
                                        className="avatar-placeholder"
                                    />
                                    <ImgCrop
                                        quality={0.9}
                                        aspect={3/3}
                                        modalTitle="Edit Image"
                                        modalOk="Apply"
                                    >
                                        <Upload
                                            accept="image/*"
                                            showUploadList={false}
                                            customRequest={customRequest}
                                            beforeUpload={beforeUpload}
                                            onChange={handleUploadChange}
                                        >
                                            <button className="avatar-add-btn">
                                                <CameraOutlined className="plus-icon" />
                                            </button>
                                        </Upload>
                                    </ImgCrop>
                                </div>
                            </div>
                            <div className="user-details">
                                <div className="username-section">
                                    <h2 className="username">{ userInfo.username }</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="profile-fields">
                        <div className="field-group">
                            <div className="field-content">
                                <label className="field-label">Username</label>
                                <div className="field-value">{ userInfo.username }</div>
                            </div>
                            <Button className="field-btn" onClick={(e) => handleOpenPopup(e, "editUsername")}>
                                Edit
                            </Button>
                        </div>

                        <div className="field-group">
                            <div className="field-content">
                                <label className="field-label">Email</label>
                                <div className="email-section">
                                    <span className="field-value">
                                        {showEmail ?  `${userInfo.email}`  : "************@gmail.com"}
                                    </span>
                                    <Button className="reveal-btn" onClick={() => setShowEmail(!showEmail)}>
                                        <span className="eye-icon">
                                            {showEmail ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </span>
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
                                <div className="field-value placeholder">{ userInfo.bio }</div>
                            </div>
                            <Button className="field-btn" onClick={(e) => handleOpenPopup(e, "editBio")}>
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="password-section">
                    <h3 className="section-title">Password and Authentication</h3>
                    <Button className="change-password-btn" onClick={(e) => handleOpenPopup(e, "changePassword")}>
                        Change Password
                    </Button>
                </div>
            </div>
            
            <Modal
                title={
                    activePopUp === 'editUsername' ? 'Edit Username' :
                    activePopUp === 'editEmail' ? 'Edit Email' :
                    activePopUp === 'editBio' ? 'Edit Bio' :
                    activePopUp === 'changePassword' ? 'Change Password' :
                    'Edit Profile'
                }
                footer={null}
                open={isPopupOpen}
                onCancel={handleCancel}
            >
                {activePopUp === 'editUsername' && <EditUsername setUserInfo={setUserInfo} />}
                {activePopUp === 'editEmail' && <EditEmail setUserInfo={setUserInfo} />}
                {activePopUp === 'editBio' && <EditBio setUserInfo={setUserInfo} />}
                {activePopUp === 'changePassword' && <EditPassword />}
            </Modal>
        </>
    );
}

export default EditProfile;