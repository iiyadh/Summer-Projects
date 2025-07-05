import { useState } from "react"
import "../styles/ManageFriends.css"


const ManageFriends = () => {
    const [activeTab, setActiveTab] = useState("friends")
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(null)

    // Sample data
    const [friends, setFriends] = useState([
        { id: "1", username: "AhmedTN", avatar: "/placeholder.svg?height=40&width=40", isOnline: true, status: "friend" },
        {
            id: "2",
            username: "EL_3OMDA69",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: true,
            status: "friend",
        },
        { id: "3", username: "GOTNIX", avatar: "/placeholder.svg?height=40&width=40", isOnline: true, status: "friend" },
        { id: "4", username: "Sarah_K", avatar: "/placeholder.svg?height=40&width=40", isOnline: false, status: "friend" },
        {
            id: "5",
            username: "BlockedUser",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: false,
            status: "blocked",
        },
    ])

    const [pendingRequests, setPendingRequests] = useState ([
        {
            id: "6",
            username: "NewUser123",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: true,
            status: "pending-received",
        },
        {
            id: "7",
            username: "GamerPro",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: false,
            status: "pending-received",
        },
    ])

    const [sentRequests, setSentRequests] = useState ([
        {
            id: "8",
            username: "PendingFriend",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: true,
            status: "pending-sent",
        },
    ])

    const handleBlock = (friendId) => {
        setFriends((prev) => prev.map((friend) => (friend.id === friendId ? { ...friend, status: "blocked" } : friend)))
        setShowDropdown(null)
    }

    const handleUnfriend = (friendId) => {
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId))
        setShowDropdown(null)
    }

    const handleUnblock = (friendId) => {
        setFriends((prev) => prev.map((friend) => (friend.id === friendId ? { ...friend, status: "friend" } : friend)))
    }

    const handleAcceptRequest = (requestId) => {
        const request = pendingRequests.find((req) => req.id === requestId)
        if (request) {
            setFriends((prev) => [...prev, { ...request, status: "friend" }])
            setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
        }
    }

    const handleDeclineRequest = (requestId) => {
        setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
    }

    const handleCancelRequest = (requestId) => {
        setSentRequests((prev) => prev.filter((req) => req.id !== requestId))
    }

    // Close dropdown when clicking outside
    const handleClickOutside = () => {
        setShowDropdown(null)
    }

    const activeFriends = friends.filter((friend) => friend.status === "friend")
    const blockedFriends = friends.filter((friend) => friend.status === "blocked")
    const onlineFriends = activeFriends.filter((friend) => friend.isOnline)

    const filteredFriends = activeFriends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredBlocked = blockedFriends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredPendingRequests = pendingRequests.filter((request) =>
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredSentRequests = sentRequests.filter((request) =>
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="friends-manager" onClick={handleClickOutside}>
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
                    All
                </button>
                <button className="add-friend-btn" onClick={() => setActiveTab("add")}>
                    Add Friend
                </button>
            </div>

            {/* Search */}
            <div className="search-container">
                <div className="search-icon"></div>
                <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Friends Tab */}
            {activeTab === "friends" && (
                <>
                    <div className="section-header">Online — {onlineFriends.length}</div>
                    <div className="friends-list">
                        {filteredFriends.length === 0 ? (
                            <div className="empty-state">No friends found</div>
                        ) : (
                            filteredFriends.map((friend) => (
                                <div key={friend.id} className="friend-item">
                                    <div className="avatar-container">
                                        <img src={friend.avatar || "/placeholder.svg"} alt={friend.username} className="avatar" />
                                        {friend.isOnline && <div className="online-indicator" />}
                                    </div>
                                    <div className="friend-info">
                                        <div className="username">{friend.username}</div>
                                    </div>
                                    <div className="friend-actions">
                                        <button className="action-btn" title="Send message">
                                            <span className="message-icon"></span>
                                        </button>
                                        <div style={{ position: "relative" }}>
                                            <button
                                                className="action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowDropdown(showDropdown === friend.id ? null : friend.id)
                                                }}
                                                title="More options"
                                            >
                                                <span className="more-icon"></span>
                                            </button>
                                            {showDropdown === friend.id && (
                                                <div className="dropdown">
                                                    <button className="dropdown-item" onClick={() => handleBlock(friend.id)}>
                                                        <span className="user-block-icon"></span>
                                                        Block
                                                    </button>
                                                    <button className="dropdown-item danger" onClick={() => handleUnfriend(friend.id)}>
                                                        <span className="user-remove-icon"></span>
                                                        Remove Friend
                                                    </button>
                                                </div>
                                            )}
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
                    <div className="section-header">Blocked — {blockedFriends.length}</div>
                    <div className="friends-list">
                        {filteredBlocked.length === 0 ? (
                            <div className="empty-state">No blocked users</div>
                        ) : (
                            filteredBlocked.map((friend) => (
                                <div key={friend.id} className="friend-item">
                                    <div className="avatar-container">
                                        <img src={friend.avatar || "/placeholder.svg"} alt={friend.username} className="avatar" />
                                    </div>
                                    <div className="friend-info">
                                        <div className="username">{friend.username}</div>
                                    </div>
                                    <div className="friend-actions">
                                        <button className="unblock-btn" onClick={() => handleUnblock(friend.id)}>
                                            Unblock
                                        </button>
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
                    <div className="section-header">Pending Requests — {filteredPendingRequests.length}</div>
                    <div className="friends-list">
                        {filteredPendingRequests.length === 0 ? (
                            <div className="empty-state">No pending requests</div>
                        ) : (
                            filteredPendingRequests.map((request) => (
                                <div key={request.id} className="friend-item">
                                    <div className="avatar-container">
                                        <img src={request.avatar || "/placeholder.svg"} alt={request.username} className="avatar" />
                                        {request.isOnline && <div className="online-indicator" />}
                                    </div>
                                    <div className="friend-info">
                                        <div className="username">
                                            {request.username}
                                            <span className="pending-badge incoming">Incoming</span>
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <button className="accept-btn" onClick={() => handleAcceptRequest(request.id)} title="Accept">
                                            <span className="check-icon"></span>
                                        </button>
                                        <button className="decline-btn" onClick={() => handleDeclineRequest(request.id)} title="Decline">
                                            <span className="x-icon"></span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sent Requests */}
                    <div className="section-header">Sent Requests — {filteredSentRequests.length}</div>
                    <div className="friends-list">
                        {filteredSentRequests.length === 0 ? (
                            <div className="empty-state">No sent requests</div>
                        ) : (
                            filteredSentRequests.map((request) => (
                                <div key={request.id} className="friend-item">
                                    <div className="avatar-container">
                                        <img src={request.avatar || "/placeholder.svg"} alt={request.username} className="avatar" />
                                        {request.isOnline && <div className="online-indicator" />}
                                    </div>
                                    <div className="friend-info">
                                        <div className="username">
                                            {request.username}
                                            <span className="pending-badge outgoing">Outgoing</span>
                                        </div>
                                    </div>
                                    <div className="friend-actions">
                                        <button className="cancel-btn" onClick={() => handleCancelRequest(request.id)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    )

}
export default ManageFriends;