
import { useState } from 'react';
import "../../styles/Auth.css";
import { Form, Input , Button ,Spin  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';



const EditBio = () => {
    const [loading , setLoading] = useState(false);

    const handleSubmit = async (values) => {
        const formData = values;
        const data = {
            bio: formData.bio,
        };
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log(data);
        }, 2000);
    }

    return (
        <div className="generic-container">
            <div className="auth-header">
                <h1>Edit Biography</h1>
                <p>You can change your Biography any time</p>
            </div>
            <Form 
                className="auth-form"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Biography"
                    name="bio"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your new Biography!' }]}
                >
                    <Input.TextArea
                        className="form-input" 
                        placeholder="Enter new Bio" 
                        disabled={loading} 
                        rows={4} 
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                    {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Edit Biography"}
                </Button>
            </Form>
        </div>
    )
}

export default EditBio;