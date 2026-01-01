import '../styles/Chat.css';
import ChatSideBar from '../Components/ChatSideBar';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import websocketService from '../services/websocket';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';

const Chat = () => {
    
    const [activeChatId, setActiveChatId] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();

    useEffect(() => {
        // Connect WebSocket when component mounts
        if (token) {
            websocketService.connect(token);
            fetchChats();
        }

        // Cleanup on unmount
        return () => {
            websocketService.disconnect();
        };
    }, [token]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/chats/chats');
            
            const formattedChats = response.data.map(chat => ({
                id: chat._id,
                name: chat.title,
                unread: 0, 
                avatar: chat.title.split(',').map(name => name.trim().split(' ').map(n => n[0]).join('')).join(''),
                participants: chat.participants
            }));
            
            setChats(formattedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="chat-container">
            <div className="chat-layout">
                <ChatSideBar 
                    chats={chats}
                    activeChatId={activeChatId}
                    setActiveChatId={setActiveChatId}
                    loading={loading}
                />
                <Outlet context={setChats}/>
            </div>
        </div>
    )
}

export default Chat;