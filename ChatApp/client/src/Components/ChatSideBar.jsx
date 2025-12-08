import '../styles/Chat.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingFilled , UserOutlined } from '@ant-design/icons';

const ChatSideBar = ({chats , activeChatId , setActiveChatId}) =>{
    const [width, setWidth] = useState(500);
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const navigate = useNavigate();

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
            {chats.map((chat) => (
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
            ))}
        </div>

        {/* User Profile */}
        <div className="user-profile">
            <div className="profile-avatar">You</div>
            <div className="profile-info">
                <div className="profile-name">Your Name</div>
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