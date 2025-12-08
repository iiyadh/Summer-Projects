import { useState } from 'react';
import "../../styles/Auth.css";
import toast from 'react-hot-toast';
import { Form, Input , Button ,Spin  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';




const EditUsername = () => {
    const [loading , setLoading] = useState(false);
  

    const handleSubmit = async (values) => {
        const formData = values;
        const data = {
            username: formData.username,
        };

        if(new RegExp(/^[a-zA-Z0-9]+$/).test(data.username) === false) {
            toast.error("Invalid Username", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log(data);
        }, 2000);
    }

    return (
        <div className="generic-container">
            <div className="auth-header">
                <h1>Change Username</h1>
                <p>You can change your Username any time</p>
            </div>
            <Form
                className="auth-form"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your new Username!' }]}
                >
                    <Input
                        className="form-input"
                        placeholder="Enter new Username"
                        disabled={loading}
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                    {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24, fontWeight: 'bolder', color: "#fff" }} spin />} /> : "Edit Username"}
                </Button>
            </Form>
        </div>
    )
}

export default EditUsername;