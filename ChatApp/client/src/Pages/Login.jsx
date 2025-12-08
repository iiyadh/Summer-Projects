import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Form, Input , Button ,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (values) =>{
        const formData = values;
        const data = {
            email: formData.email,
            password: formData.password,
        };
        setLoading(true);
        try {
            const result = await login(data);
            if(result.success) {
                toast.success(result.data.message,{
                        duration: 2500,
                        removeDelay: 500,
                    }
                );
                navigate('/chat');
            } else {
                toast.error(result.error,{
                    duration: 2500,
                    removeDelay: 500,
                });
            }
        }catch(err){
            toast.error("Something went wrong. Please try again.",{
                duration: 2500,
                removeDelay: 500,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to Chat App</p>
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
                        <Form.Item
                            label="Password"
                            name="password"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password  className='form-input'/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                            {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Sign In"}
                        </Button>
                </Form>
                <div className="auth-link">
                    <p>Forgot your password? <Link to="/forgot-password">Reset it here</Link></p>
                </div>
                <div className="auth-link">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;