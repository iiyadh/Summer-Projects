import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Form, Input , Button ,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { register } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (values) =>{
        const formData = values;
        const data = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        }

        if(data.password !== formData.cpassword) {
            toast.error("Passwords do not match",{
                duration: 2500,
                removeDelay:500,
            });
            return;
        }


        if(new RegExp(/^[a-zA-Z0-9]+$/).test(data.username) === false) {
            toast.error("Invalid Username", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        if(new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/).test(data.password) === false) {
            toast.error("Weak Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }
        setLoading(true);
        try{
            const result = await register(data);
            if(result.success) {
                toast.success(result.data.message, {
                    duration: 2500,
                    removeDelay: 500,
                });
                navigate('/login');
            }else{
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
                    <h1>Create Account</h1>
                    <p>Sign up to get started with Chat App</p>
                </div>
                <Form
                    className='auth-form'
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                        <Form.Item
                            label="Username"
                            name="username"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input className='form-input'/>
                        </Form.Item>
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
                        <Form.Item
                            label="Confirme Password"
                            name="cpassword"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your Confirme Passoword!' }]}
                        >
                            <Input.Password  className='form-input'/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                            {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Sign Up"}
                        </Button>
                </Form>
                <div className="auth-link">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;