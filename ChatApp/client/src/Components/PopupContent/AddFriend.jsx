import { Avatar, Button, Form , Input} from "antd";
import { useState } from "react";
import "../../styles/ManageFriends.css";


const AddFriend = () =>{
    const [ users, setUsers ] = useState([]);
    return (
        <Form>
            <Form.Item
                label="Friend's Username"
                name="friendUsername"
                layout='vertical'
                rules={[{ required: true, message: "Please input your friend's username!" }]}
            >
                <Input.Search
                    className="form-input"
                    placeholder="Enter friend's username"
                />
            </Form.Item>
            <div className="friends-list">
                {users.map((user) => (
                    <div key={user.id} className="friend-item">
                        <Avatar 
                            className="friend-avatar"
                            src={user.profilePicture}
                            icon={!user?.profilePicture && <UserOutlined />}
                            >
                        </Avatar>
                        <div className="friend-username">{user.username}</div>
                        <Button className="add-friend-button">Add Friend</Button>
                    </div>
                ))}
            </div>
        </Form>
    )
}



export default AddFriend;