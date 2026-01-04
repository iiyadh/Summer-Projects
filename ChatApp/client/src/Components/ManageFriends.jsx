import { useEffect, useState } from "react"
import "../styles/ManageFriends.css"
import { Input, Dropdown, Button, Modal, Avatar, message } from "antd"
import { StopOutlined, UserDeleteOutlined, MoreOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import AddFriend from "./PopupContent/AddFriend.jsx";
import api from "../api/api";
import { useNavigate , useOutletContext} from "react-router-dom";
import websocketService from "../services/websocket";


const ManageFriends = () => {
    const [activeTab, setActiveTab] = useState("friends")
    const [searchQuery, setSearchQuery] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();
    const setChats = useOutletContext();


    
    const handleCancel = () => {
        setIsPopupOpen(false);
    }

    // Sample data
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [blockedFriendslist, setBlockedFriendslist] = useState([]);


    const fetchPendingRequests = async () => {
        try {
            const res = await api.get('/friends/friend-requests');
            setPendingRequests(res.data);
        } catch (err) {
            console.error("Error fetching pending requests:", err);
        }
    }


    const fetchSentRequests = async () => {
        try {
            const res = await api.get('/friends/sent-requests');
            setSentRequests(res.data);
        } catch (err) {
            console.error("Error fetching sent requests:", err);
        }
    }

    const fetchFriends = async () => {
        try {
            const res = await api.get('/friends/friends');
            setFriends(res.data || []);
        } catch (err) {
            console.error("Error fetching friends:", err);
        }
    }

    const fetchBlcokedFriends = async () => {
        try {
            const res = await api.get('/friends/blocked-users');
            setBlockedFriendslist(res.data || []);
        } catch (err) {
            console.error("Error fetching blocked friends:", err);
        }
    };


    useEffect(() => {
        fetchPendingRequests();
        fetchSentRequests();
        fetchFriends();
        fetchBlcokedFriends();

        // Listen for user status updates
        const handleUserStatus = (data) => {
            const { userId, status } = data;
            setFriends((prevFriends) => 
                prevFriends.map((friend) => 
                    friend._id === userId 
                        ? { ...friend, status } 
                        : friend
                )
            );
        };

        websocketService.on('user_status', handleUserStatus);

        // Cleanup listener on unmount
        return () => {
            websocketService.off('user_status', handleUserStatus);
        };
    }, []);

    const handleBlock = async (friendId) => {
        try {
            await api.post(`/friends/block-friend`, { friendId });
            setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
            setBlockedFriendslist((prev) => [...prev, friends.find((friend) => friend._id === friendId)]);
        } catch (err) {
            console.error("Error blocking friend:", err);
        }
    }

    const handleUnfriend = async (friendId) => {
        try {
            await api.post(`/friends/remove-friend/${friendId}`);
            setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
        } catch (err) {
            console.error("Error removing friend:", err);
        }
    }

    const handleUnblock = async (friendId) => {
        try {
            await api.post(`/friends/unblock-friend`, { friendId });
            setBlockedFriendslist((prev) => prev.filter((friend) => friend._id !== friendId));
        } catch (err) {
            console.error("Error unblocking friend:", err);
        }
    }

    const handleAcceptRequest = async (requestId) => {
        try {
            await api.post('/friends/accept-friend-request', { requestId });
            setPendingRequests((prev) => prev.filter((request) => request._id !== requestId));
            fetchFriends();
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    }

    const handleRejectRequest = async (requestId) => {
        try {
            await api.post('/friends/reject-friend-request', { requestId });
            setPendingRequests((prev) => prev.filter((request) => request._id !== requestId));
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    }

    const handleCancelRequest = async (requestId) => {
        try {
            await api.post('/friends/deny-sent-request', { requestId });
            setSentRequests((prev) => prev.filter((request) => request._id !== requestId));
        } catch (err) {
            console.error("Error cancelling request:", err);
        }
    }

    const handleChat = async (friendId) => {
        try {
            const response = await api.post('/chats/create-chat', {
                participantId: friendId
            });
            
            if (response.data._id) {
                navigate(`/chat/${response.data._id}`);
            }

            setChats((prevChats) => [...prevChats, {
                id: response.data._id,
                name: response.data.title,
                unread: 0, 
                avatar: response.data.title.split(',').map(name => name.trim().split(' ').map(n => n[0]).join('')).join(''),
                participants: response.data.participants
            }]);
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.chatId) {
                navigate(`/chat/${err.response.data.chatId}`);
            } else {
                console.error("Error creating chat:", err);
                message.error("Failed to create chat");
            }
        }
    }

    const filteredFriends = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredBlocked = blockedFriendslist.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredPendingRequests = pendingRequests.filter((request) =>
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredSentRequests = sentRequests.filter((request) =>
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="friends-manager">
            {/* Navigation */}
            <div className="nav-tabs">
                <button
                    className={`nav-tab ${activeTab === "friends" ? "active" : ""}`}
                    onClick={() => setActiveTab("friends")}
                >
                    Friends
                </button>
                <button
                    className={`nav-tab ${activeTab === "blocked" ? "active" : ""}`}
                    onClick={() => setActiveTab("blocked")}
                >
                    Blocked
                </button>
                <button className={`nav-tab ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
                    Requests
                </button>
                <Button 
                    className="add-friend-btn"
                    onClick={() => setIsPopupOpen(true)}>
                    Add Friend
                </Button>
            </div>

            {/* Search */}
            {activeTab !== 'add' && (
                <Input.Search 
                    placeholder="Type name ..." 
                    variant="filled" 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            )}

            {/* Friends Tab */}
            {activeTab === "friends" && (
                <>
                    <div className="section-header">Friends — {filteredFriends.length}</div>
                    <div className="friends-list">
                        {filteredFriends.length === 0 ? (
                            <div className="empty-state">No friends found</div>
                        ) : (
                            filteredFriends.map((user) => (
                                <div key={user._id} className="friend-item">
                                    <div className="friend-info">
                                        <Avatar
                                            className="friend-avatar"
                                            src={user.profilePicture}
                                            icon={!user?.profilePicture && <UserOutlined />}
                                        />
                                        <div className="friend-username">{user.username}</div>
                                        <div className={`friend-status ${user.status === 'online' ? 'status-online' : 'status-offline'}`}>
                                            <span className="status-indicator"></span>
                                            {user.status === 'online' ? 'Online' : 'Offline'}
                                        </div>
                                    </div>
                                    <div className="friend-actions">
                                        <Button 
                                            type="text"
                                            className="action-btn"
                                            title="Send message"
                                            icon={<MessageOutlined />}
                                            onClick={() => handleChat(user._id)}
                                        />
                                        <div style={{ position: "relative" }}>
                                            <Dropdown menu={{ 
                                                items: [
                                                    {
                                                        key: 'remove',
                                                        label: "Remove Friend",
                                                        icon: <UserDeleteOutlined />
                                                    },                                                    
                                                    {
                                                        key: 'block',
                                                        label: "Block",
                                                        icon: <StopOutlined style={{ color: "red" }} />
                                                    }
                                                ],
                                                onClick: ({ key }) => {
                                                    if (key === 'block') handleBlock(user._id);
                                                    else if (key === 'remove') handleUnfriend(user._id);
                                                }
                                            }} trigger={['click']}>
                                                <MoreOutlined style={{ rotate: "90deg" }} />
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Blocked Tab */}
            {activeTab === "blocked" && (
                <>
                    <div className="section-header">Blocked — {blockedFriendslist.length}</div>
                    <div className="friends-list">
                        {filteredBlocked.length === 0 ? (
                            <div className="empty-state">No blocked users</div>
                        ) : (
                            filteredBlocked.map((friend) => (
                                <div key={friend._id} className="friend-item">
                                    <div className="friend-info">
                                        <Avatar 
                                            className="avatar-container"
                                            size={43}
                                            src={friend.profilePicture}
                                        />
                                        <div className="username">{friend.username}</div>
                                    </div>
                                    <div className="friend-actions">
                                        <Button className="unblock-btn" onClick={() => handleUnblock(friend._id)}>
                                            Unblock
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Add Friend Tab */}
            {activeTab === "add" && (
                <>
                    {/* Pending Requests */}
                    <div className="section-header">Pending Requests — {pendingRequests.length}</div>
                    <div className="friends-list">
                        {filteredPendingRequests.length === 0 ? (
                            <div className="empty-state">No pending requests</div>
                        ) : (
                            filteredPendingRequests.map((request) => (
                                <div key={request._id} className="friend-item">
                                    <div className="friend-info">
                                        <Avatar 
                                            size={43}
                                            className="avatar-container"
                                            src={request.profilePicture}
                                        />
                                        <div className="username">
                                            {request.username}
                                            <span className="pending-badge incoming">Incoming</span>
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <Button className="accept-btn" onClick={() => handleAcceptRequest(request._id)} title="Accept">
                                            <span className="check-icon"></span>
                                        </Button>
                                        <Button className="decline-btn" onClick={() => handleRejectRequest(request._id)} title="Decline">
                                            <span className="x-icon"></span>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sent Requests */}
                    <div className="section-header">Sent Requests — {sentRequests.length}</div>
                    <div className="friends-list">
                        {filteredSentRequests.length === 0 ? (
                            <div className="empty-state">No sent requests</div>
                        ) : (
                            filteredSentRequests.map((request) => (
                                <div key={request._id} className="friend-item">
                                    <div className="friend-info">
                                        <Avatar 
                                            size={43}
                                            className="avatar-container"
                                            src={request.profilePicture}
                                        />
                                        <div className="username">
                                            {request.username}
                                            <span className="pending-badge outgoing">Outgoing</span>
                                        </div>
                                    </div>
                                    <div className="friend-actions">
                                        <Button className="cancel-btn" onClick={() => handleCancelRequest(request._id)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
            <Modal 
                title="Add Friend"
                open={isPopupOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <AddFriend setSentRequests={setSentRequests} />
            </Modal>
        </div>
    )
}

export default ManageFriends;