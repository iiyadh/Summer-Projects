import '../styles/Chat.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingFilled , UserOutlined } from '@ant-design/icons';
import { useUserStore } from '../store/userStore';
import { Avatar, Spin } from 'antd';
import { useEffect } from 'react';

const ChatSideBar = ({chats , activeChatId , setActiveChatId, loading}) =>{
    const [width, setWidth] = useState(500);
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const { getUserProfile } = useUserStore();

    const handleMouseDown = () =>{
        isResizing.current = true;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e) => {
        if (isResizing.current) {
            const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
            if (newWidth > 250 && newWidth < 500) {
                setWidth(newWidth);
            }
        }
    }

    const handleMouseUp = () =>{
        isResizing.current = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleSelectChat = (id) => {
        setActiveChatId(id);
        navigate(`/chat/${id}`);
    }

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

    return (
    <div
        ref={sidebarRef}
        className="chat-sidebar"
        style={{ width: `${width}px` }}
    >
        <div className={`sidebar-header ${activeChatId === 'friends' ? 'activeheader' : ''}`} onClick={() => {navigate('/chat/friends');setActiveChatId("friends")}}>
            <UserOutlined  className="friends-icon" />
            <h2>Friends</h2>
        </div>

        <div className="chat-list">
            <p className='dm'>Direct Messages</p>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            ) : chats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    No chats yet. Start a conversation!
                </div>
            ) : (
                chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
                        onClick={()=>handleSelectChat(chat.id)}
                    >
                        <div className="chat-avatar">{chat.avatar}</div>
                        <div className="chat-info">
                            <div className="chat-name">{chat.name}</div>
                        </div>
                        <div className="chat-meta">{chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}</div>
                    </div>
                ))
            )}
        </div>

        {/* User Profile */}
        <div className="user-profile">
            <Avatar
                size={45}
                src={userInfo.profilePicture}
                icon={!userInfo?.profilePicture && <UserOutlined />}
                className="profile-avatar"
            />
            <div className="profile-info">
                <div className="profile-name">{ userInfo.username }</div>
                <div className="profile-status">Online</div>
            </div>
            <div className="profile-settings">
                <SettingFilled className="settings-icon" onClick={() => navigate('/settings')} />
            </div>
        </div>

        <div 
            className='resizer' 
            onMouseDown={handleMouseDown}
        ></div>
    </div>
    )
}
export default ChatSideBar;