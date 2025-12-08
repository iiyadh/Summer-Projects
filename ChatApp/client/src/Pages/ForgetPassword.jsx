import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Form, Input , Button ,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) =>{
        const formData = values;
        const email = formData.email;
        setLoading(true);
        try{
            const res = await api.post('/recovery/forgot', { email });
            if(res.status === 200){
                toast.success(res.data.message, {
                    duration: 2500,
                    removeDelay: 500,
                });
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>
                <Form
                    className='auth-form'
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                        <Form.Item
                            label="Email"
                            name="email"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input  className='form-input'/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                            {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Send Reset Link"}
                        </Button>
                </Form>
                <div className="auth-link">
                    <p>Remember your password? <Link to="/login">Back to Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;