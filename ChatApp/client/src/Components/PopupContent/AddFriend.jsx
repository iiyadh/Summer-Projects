import { Avatar, Button, Form , Input} from "antd";
import { useState } from "react";
import "../../styles/ManageFriends.css";
import api from "../../api/api";
import toast from "react-hot-toast";


const AddFriend = ({setSentRequests}) =>{
    const [ users, setUsers ] = useState([]);
    

    const fetchUsers = async (keyword) => {
        try{
            const response =  await api.get('/friends/users-not-friends', {
                params: {
                    keyword: keyword
                }
            });
            setUsers(response.data);
        }catch (error){
            console.error("Error fetching users:", error);
        }
    };


    const handleAddFriend = async (friend_id) => {
        try{
            const res = await api.post('/friends/add-friend', {
                friendId: friend_id
            });
            setUsers(users.filter(user => user._id !== friend_id));
            setSentRequests((prev) => [...prev, res.data.friendRequest]);
            toast.success(res.data.message);
        }catch(err){
            console.error("Error adding friend:", err);
            toast.error(err.response.data.message || "Failed to send friend request.");
        }
    };

    return (
        <Form>
            <Form.Item
                label="Username"
                name="username"
                layout='vertical'
                rules={[{ required: true, message: "Please input your friend's username!" }]}
            >
                <Input.Search
                    className="form-input"
                    placeholder="Enter friend's username"
                    enterButton="Search"
                    size="large"
                    onSearch={fetchUsers}
                />
            </Form.Item>
            <div className="friends-list">
                {users.map((user) => (
                    <div key={user._id} className="friend-item">
                        <div className="friend-info">
                            <Avatar
                                className="friend-avatar"
                                src={user.profilePicture}
                                icon={!user?.profilePicture && <UserOutlined />}
                            >
                            </Avatar>
                            <div className="friend-username">{user.username}</div>
                        </div>
                        <Button className="add-friend-button" onClick={() =>handleAddFriend(user._id)}>Add Friend</Button>
                    </div>
                ))}
                {users.length === 0 && <div className="no-users">No users found.</div>}
            </div>
        </Form>
    )
}



export default AddFriend;