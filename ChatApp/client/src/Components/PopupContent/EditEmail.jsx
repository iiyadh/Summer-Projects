import "../../styles/Auth.css";
import { useState  } from 'react';
import OtpInput from "react-otp-input";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import  { useUserStore } from "../../store/userStore";



const EditEmail = ( {setUserInfo} ) => {
    const navigate = useNavigate();
    const [optCode,setOptCode] = useState("");
    const [verfied, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateEmail ,verifyOTPCode } = useUserStore();

    const handleVerfiy = async (e) => {
        e.preventDefault();
        if(!new RegExp('^[0-9]{4}$').test(optCode)) {
            toast.error("Invalid OTP Code");
            return;
        }
        setLoading(true);
        try {
            setLoading(false);
            await verifyOTPCode(optCode);
            setVerified(true);
            toast.success("OTP Verified Successfully", {
                duration: 2500,
                removeDelay: 500,
            });
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (values) => {
        const formData = values;
        const data = {
            email: formData.email,
        };

        if(!new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(data.email)) {
            toast.error("Invalid E-mail", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }
        setLoading(true);
        try{
            setLoading(false);
            await updateEmail(data.email);
            setUserInfo(prev => ({...prev, email: data.email}));
            toast.success("E-mail changed successfully", {
                duration: 2500,
                removeDelay: 500,
            });
            navigate('/settings');
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        {!verfied && <div className="generic-container">
            <div className="auth-header">
                <h1>Change E-mail</h1>
                <p>We have sent code with 4 degits on your email tabaiiyadh317@gmail.com</p>
            </div>
            <Form className="auth-form">
                <div className="form-group">
                    <label htmlFor="opt">Enter Verification code Here</label>
                    <OtpInput
                        value={optCode}
                        onChange={setOptCode}
                        numInputs={4}
                        inputStyle={{
                            fontSize: '24px',
                            border: '2px solid #ccc',
                            borderRadius: '10px',
                            textAlign: 'center',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                            width: '50px',
                            height: '50px'
                        }}
                        containerStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '20px'
                        }}
                        renderSeparator={<span style={{ fontSize: '24px', fontWeight: 'bold', color: '#888' }}>-</span>}
                        renderInput={(props) => <input {...props} />}
                    />
                </div>
                <Button type="submit" className="auth-button" disabled={loading} onClick={handleVerfiy}>
                    {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} />: "Verify"}</Button>
            </Form>
        </div>}
        {verfied && <div className="generic-container">
            <div className="auth-header">
                <h1>Edit E-mail</h1>
                <p>You can change your E-mail any time</p>
            </div>
            <Form className="auth-form" 
                onFinish={handleSubmit} >
                <div className="form-group">
                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[{ required: true, message: 'Please input your new E-mail!' }]}
                        style={{ width: '100%' }}
                        layout='vertical'
                        className="form-group"
                    >
                        <Input 
                            placeholder="Enter new email"
                            disabled={loading} 
                            className="form-input"
                            />
                    </Form.Item>
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} />: "Change E-mail"}</button>
            </Form>
        </div>}
    </>
    )
}

export default EditEmail;