import '../styles/Chat.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Form, Input, Button, Dropdown, Avatar, Modal, Select } from 'antd';
import { PhoneOutlined ,InfoCircleOutlined , PlusOutlined ,SendOutlined ,SmileFilled ,DeleteOutlined , MoreOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import websocketService from '../services/websocket';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import { useNavigate, useOutletContext } from 'react-router-dom';


const { Option } = Select;

const ChatHistory = ()=>{

    const [message, setMessage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const { chatId } = useParams();
    const { token, uid } = useAuthStore();
    const [chatInfo, setChatInfo] = useState({ participants: [], title: '' });
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const [toeditMessageId, setToeditMessageId] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [editMessageText, setEditMessageText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [friendslist, setFriendslist] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const navigate = useNavigate();
    const setChats = useOutletContext();
    const [chatInfoModalVisible, setChatInfoModalVisible] = useState(false);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {
        if (chatId) {
            fetchMessages();
            fetchChatInfo();
            fetchFriends();
        }
    }, [chatId]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            if (data.chatId === chatId) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: data.message.content,
                    sender: userMap[data.message.sender]?.username || data.message.sender,
                    profilePicture: userMap[data.message.sender]?.profilePicture || '',
                    timestamp: new Date(data.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: data.message.sender === uid
                }]);
            }
        };
        const handleTyping = (data) => {
            if (data.chatId === chatId) {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    if (data.isTyping) {
                        newSet.add(data.userId);
                    } else {
                        newSet.delete(data.userId);
                    }
                    return newSet;
                });
            }
        };

        websocketService.on('new_message', handleNewMessage);
        websocketService.on('user_typing', handleTyping);

        return () => {
            websocketService.off('new_message', handleNewMessage);
            websocketService.off('user_typing', handleTyping);
        };
    }, [chatId, uid, userMap]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chats/messages/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const userMapping = {};
            const formattedMessages = response.data.map((msg) => {
                userMapping[msg.sender._id] = {
                    username: msg.sender.username,
                    profilePicture: msg.sender.profilePicture
                };
                return {
                    id: msg._id,
                    text: msg.content,
                    sender: msg.sender.username,
                    profilePicture: msg.sender.profilePicture,
                    timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: msg.sender._id === uid
                };
            });
            
            setUserMap(userMapping);
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchChatInfo = async () => {
        try {
            const response = await api.get('/chats/chats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const chat = response.data.find(c => c._id === chatId);
            if (chat) {
                const userMapping = {};
                chat.participants.forEach(p => {
                    userMapping[p._id] = {
                        username: p.username,
                        profilePicture: p.profilePicture
                    };
                });
                
                setUserMap(prev => ({ ...prev, ...userMapping }));
                setChatInfo({
                    participants: chat.participants.map(p => p._id),
                    title: chat.title,
                });
            }
        } catch (error) {
            console.error('Error fetching chat info:', error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                const response = await api.post('/chats/send-message', {
                    chatId,
                    content: message
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                websocketService.sendMessage(chatId, message, chatInfo.participants);
                setMessages(prev => [...prev, {
                    id: response.data.data._id,
                    text: message,
                    sender: response.data.data.sender.username,
                    profilePicture: response.data.data.sender.profilePicture,
                    timestamp: new Date(response.data.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: true
                }]);

                setMessage("");
                websocketService.sendTyping(chatId, chatInfo.participants, false);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        if (value.trim()) {
            websocketService.sendTyping(chatId, chatInfo.participants, true);
            const timeout = setTimeout(() => {
                websocketService.sendTyping(chatId, chatInfo.participants, false);
            }, 2000);
            
            setTypingTimeout(timeout);
        } else {
            websocketService.sendTyping(chatId, chatInfo.participants, false);
        }
    };

    const handleInputBlur = () => {
        websocketService.sendTyping(chatId, chatInfo.participants, false);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    };

    const handleEditMessage = async (messageId) => {
        try{
            await api.put(`/chats/edit-message/${messageId}`, {
                newContent: editMessageText});
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.id === messageId ? { ...msg, text: editMessageText } : msg
            ));
            setToeditMessageId(null);
        }catch(err){
            console.error('Error editing message:', err);
        }
    }

    const handleDeleteMessage = async (messageId) => {
        try{
            await api.delete(`/chats/delete-message/${messageId}`);
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        }
        catch(err){
            console.error('Error deleting message:', err);
        }
    };
    
    const fetchFriends = async () => {
        try {
            const res = await api.get('/chats/friends');
            setFriendslist(res.data);
        }catch(err){
            console.error('Error fetching friends:', err);
        }
    };

    const handleCreateGroupChat = async (selectedUserIds) => {
        try{
            const res = await api.post('/chats/create-group-chat', { participantIds : selectedUserIds });
            setChats(prevChats => [...prevChats, {
                id: res.data._id,
                name: res.data.title,
                unread: 0,
                avatar: res.data.title.split(',').map(name => name.trim().split(' ').map(n => n[0]).join('')).join(''),
                participants: res.data.participants
            }]);
            navigate(`/chat/${res.data._id}`);
        }catch(err){
            console.error('Error creating group chat:', err);
        }
    }


    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

    return(
        <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-title">
                    <div className="chat-avatar small">{chatInfo.name}</div>
                    <div>
                        <h3>{chatInfo.title || 'Chat'}</h3>
                        <span className="member-count">{chatInfo.participants.length} members</span>
                    </div>
                </div>
                <div className="chat-actions">
                    <PhoneOutlined className="action-btn" />
                    <Button type='text'
                        icon={<InfoCircleOutlined />}
                        onClick={() => setChatInfoModalVisible(true)}
                    >
                    </Button>
                    <Button type='text'
                        icon={<PlusOutlined />} 
                        onClick={()=>{
                        setModalVisible(true);
                    }}></Button>
                </div>
                <Modal
                    title="Add Participants"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible(false)}>
                            Cancel
                        </Button>,
                        <Button key="add" type="primary" onClick={() => {
                            handleCreateGroupChat(selectedFriends);
                            setModalVisible(false);
                        }}>
                            Add
                        </Button>
                    ]}
                    width={500}
                >
                    <Select
                        mode="multiple"
                        placeholder="Search and select friends to add"
                        style={{ width: '100%' }}
                        size="large"
                        showSearch
                        value={selectedFriends}
                        filterOption={(input, option) =>
                            String(option?.label || '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        optionLabelProp="label"
                        onChange={(value) => setSelectedFriends(value)}
                    >
                        {friendslist.map(user => (
                            <Option 
                                key={user._id} 
                                value={user._id}
                                label={user.username}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                                    <Avatar 
                                        src={user.profilePicture} 
                                        size={32}
                                        style={{ marginRight: '12px', flexShrink: 0 }}
                                    >
                                        {user.username[0]}
                                    </Avatar>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                        {user.username}
                                    </span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Modal>


                <Modal
                    title="Chat Information"
                    open={chatInfoModalVisible}
                    onCancel={() => setChatInfoModalVisible(false)}
                    footer={null}
                    width={400}
                >
                    <h3>Participants:</h3>
                    <ul>
                        {chatInfo.participants.map(participantId => (
                            <li key={participantId} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                    src={userMap[participantId]?.profilePicture} 
                                    size={32}
                                    style={{ marginRight: '12px', flexShrink: 0 }}
                                >
                                    {userMap[participantId]?.username[0]}
                                </Avatar>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {userMap[participantId]?.username || 'Unknown User'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Modal>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.isOwn ? "own" : ""}`}>
                        {!msg.isOwn && (
                            <Avatar 
                                src={msg.profilePicture} 
                                className="message-avatar"
                            >
                                {msg.sender[0]}
                            </Avatar>
                        )}
                        {toeditMessageId!==msg.id  && <div className="message-content">
                            {!msg.isOwn && <div className="message-sender">{msg.sender}</div>}
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">{msg.timestamp}</div>
                        </div>}
                        {toeditMessageId==msg.id &&
                            <div className="message-edit-area">
                                <Input.TextArea className="edit-message-input" defaultValue={msg.text} value={editMessageText} onChange={(e)=>setEditMessageText(e.target.value)} />
                                <div className="edit-message-actions">
                                    <Button type='text' className="save-edit-btn" onClick={()=>handleEditMessage(msg.id)}>Save</Button>
                                    <Button type='text' className="cancel-edit-btn" onClick={() => setToeditMessageId(null)}>Cancel</Button>
                                </div>
                            </div>
                        }
                            {true && 
                            <Dropdown
                                menu={{items: [
                                    {
                                        key: '1',
                                        label: 'Delete Message',
                                        icon: <DeleteOutlined style={{color:"red"}}/>
                                    },
                                    {
                                        key: '2',
                                        label: 'Edit Message',
                                        icon: <InfoCircleOutlined />
                                    },
                                ],
                                onClick: ({key}) => {
                                    if(key === '1'){
                                        handleDeleteMessage(msg.id);
                                    }
                                    else if(key === '2'){
                                        setEditMessageText(msg.text);
                                        setToeditMessageId(msg.id);
                                    }
                                }
                            }} trigger={['click']}>
                            <MoreOutlined style={{ rotate: "90deg" }} />
                            </Dropdown>
                        }
                    </div>
                ))}
                {typingUsers.size > 0 && (
                    <div className="typing-indicator">
                        <span>{Array.from(typingUsers).map(userId => userMap[userId]?.username).filter(Boolean).join(', ') || 'Someone'} typing ...</span>
                    
                    </div>
                )}
                <div ref={messagesEndRef} />
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
                        }}
                        itemRender={() => null}
                        >
          
                        <PlusOutlined  />
                    </Upload >
                    <Input.TextArea
                        value={message}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
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