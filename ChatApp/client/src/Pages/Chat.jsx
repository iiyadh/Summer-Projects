import '../styles/Chat.css';
import ChatSideBar from '../Components/ChatSideBar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Chat = () => {
    
    const [activeChatId, setActiveChatId] = useState(null);


    const chats = [
        {
            id: 0,
            name: "Development Team",
            unread: 3,
            avatar: "DT",
        },
        {
            id: 1,
            name: "Sarah Wilson",
            unread: 0,
            avatar: "SW",
        },
        {
            id: 2,
            name: "Project Alpha",
            unread: 1,
            avatar: "PA",
        },
        {
            id: 3,
            name: "Mike Chen",
            unread: 0,
            avatar: "MC",
        },
        {
            id: 4,
            name: "Design Review",
            unread: 2,
            avatar: "DR",
        },
        {
            id: 5,
            name: "Emma Davis",
            unread: 0,
            avatar: "ED",
        },
        {
            id: 6,
            name: "Backend Team",
            unread: 0,
            avatar: "BT",
        },
        {
            id: 7,
            name: "Lisa Park",
            unread: 0,
            avatar: "LP",
        },
    ]

    const messages = [
        {
            id: 1,
            text: "Hey everyone! How's the progress on the new dashboard?",
            sender: "Sarah Wilson",
            timestamp: "10:30 AM",
            isOwn: false,
        },
        {
            id: 2,
            text: "Going well! We've implemented the user authentication and are working on the data visualization components.",
            sender: "You",
            timestamp: "10:32 AM",
            isOwn: true,
        },
        {
            id: 3,
            text: "That's awesome! Can you share a preview when it's ready?",
            sender: "Mike Chen",
            timestamp: "10:35 AM",
            isOwn: false,
        },
        { id: 4, text: "I'll have something to show by end of day.", sender: "You", timestamp: "10:36 AM", isOwn: true },
        {
            id: 5,
            text: "Perfect! Looking forward to seeing it. The client is really excited about this project.",
            sender: "Sarah Wilson",
            timestamp: "10:38 AM",
            isOwn: false,
        },
        {
            id: 6,
            text: "Let's schedule a quick demo session tomorrow morning to review everything together.",
            sender: "You",
            timestamp: "10:40 AM",
            isOwn: true,
        },
    ]
    return (
        <div className="chat-container">
            <div className="chat-layout">
                <ChatSideBar 
                    chats={chats}
                    activeChatId={activeChatId}
                    setActiveChatId={setActiveChatId}
                />
                <Outlet context={{messages}}/>
            </div>
        </div>
    )
}

export default Chat;