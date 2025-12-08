import '../styles/Chat.css';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Upload, Form, Input, Button } from 'antd';
import { PhoneOutlined ,InfoCircleOutlined , PlusOutlined ,SendOutlined ,SmileFilled ,DeleteOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';

const ChatHistory = ()=>{

    const [message, setMessage] = useState("");
    const [fileList, setFileList] = useState([]);
    const { messages } = useOutletContext();
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

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
                    <PhoneOutlined className="action-btn" />
                    <InfoCircleOutlined className="action-btn"/>
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
                <div className='uploaded-files'>
                    {fileList.map(file => (
                        <div key={file.uid} className="uploaded-file">
                            <span><h4>{file.name}</h4> <p>({(file.size / 1024).toFixed(2)} KB)</p></span>
                            <Button
                            onClick={() => {
                                setFileList(fileList.filter(f => f.uid !== file.uid));}}
                                type="text"
                                icon={<DeleteOutlined style={{color:"red"}}/>}
                            >
                            </Button>
                        </div>
                    
                    ))}
                </div>
                <Form
                    onFinish={handleSendMessage}
                    className="message-form"
                >
                <div className="input-container">
                    <Upload 
                        className='attachment-btn'
                        fileList={fileList}
                        onChange={({fileList}) => {
                            setFileList(fileList);
                            console.log(fileList);
                        }}
                        itemRender={() => null}
                        >
          
                        <PlusOutlined  />
                    </Upload >
                    <Input.TextArea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="message-input"
                        bordered={false}
                        size="small"
                         />
                    <Button 
                        type="button" 
                        className="emoji-btn"
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                        icon={<SmileFilled />}
                        >
                    </Button>
                    { emojiPickerVisible && <EmojiPicker
                        className="emoji-board"
                        onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
                    />
                    }
                    
                </div>
                    <Button 
                        type="primary"
                        htmlType="submit"
                        className="send-button"
                        icon={<SendOutlined />}
                        disabled={!message.trim() && fileList.length === 0}>
                    </Button>
                </Form>

            </div>
        </div>
    )
}

export default ChatHistory;