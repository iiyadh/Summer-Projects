import '../styles/Chat.css';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const ChatHistory = ()=>{

    const [message, setMessage] = useState("");
    const { messages } = useOutletContext();

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (message.trim()) {
            console.log("Sending message:", message)
            setMessage("");
        }
    }

    return(
        <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-title">
                    <div className="chat-avatar small">DT</div>
                    <div>
                        <h3>Development Team</h3>
                        <span className="member-count">8 members</span>
                    </div>
                </div>
                <div className="chat-actions">
                    <button className="action-btn">📞</button>
                    <button className="action-btn">📹</button>
                    <button className="action-btn">ℹ️</button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.isOwn ? "own" : ""}`}>
                        {!msg.isOwn && (
                            <div className="message-avatar">
                                {msg.sender
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                        )}
                        <div className="message-content">
                            {!msg.isOwn && <div className="message-sender">{msg.sender}</div>}
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">{msg.timestamp}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="message-input-area">
                <form onSubmit={handleSendMessage} className="message-form">
                    <div className="input-container">
                        <button type="button" className="attachment-btn">
                            📎
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="message-input"
                        />
                        <button type="button" className="emoji-btn">
                            😊
                        </button>
                        <button type="submit" className="send-button" disabled={!message.trim()}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatHistory;