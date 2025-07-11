import '../styles/Chat.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="sidebar-header" onClick={() => {navigate('/chat/friends');setActiveChatId(null)}}>
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                className="friends-icon"
            >
                <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
            </svg>
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
                <svg 
                    className="settings-icon" 
                    onClick={() => navigate('/settings')}
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24"
                >
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
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