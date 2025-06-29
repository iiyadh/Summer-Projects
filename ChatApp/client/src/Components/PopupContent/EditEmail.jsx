import Loader from "../../effects/Loader";
import "../../styles/Auth.css";
import { useLoadingStore } from "../../store/loadingStore";
import { useEffect, useState , useRef } from 'react';
import OtpInput from "react-otp-input";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";



const EditEmail = () => {
    const navigate = useNavigate();
    const formRef = useRef();
    const [optCode,setOptCode] = useState("");
    const { loading, show, hide } = useLoadingStore();
    const [verfied, setVerified] = useState(false);


    useEffect(() => {
        const ans = window.confirm("Are you sure you want to change your E-mail?");
        if(!ans) {
            navigate('/settings');
        }
    }, []);

    const handleVerfiy = async (e) => {
        e.preventDefault();
        if(!new RegExp('^[0-9]{4}$').test(optCode)) {
            toast.error("Invalid OTP Code");
            return;
        }
        show();
        setTimeout(() => {
            hide();
            setOptCode("");
            setVerified(true);
        }, 2000);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            email: formData.get('email'),
        };

        if(!new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(data.email)) {
            toast.error("Invalid E-mail", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }
        show();
        setTimeout(() => {
            hide();
            formRef.current.reset();
            console.log(data);
            toast.success("E-mail changed successfully", {
                duration: 2500,
                removeDelay: 500,
            });
            navigate('/settings');
        }, 2000);
    }

    return (
        <>
        {!verfied && <div className="generic-container">
            <div className="auth-header">
                <h1>Change E-mail</h1>
                <p>We have sent code with 4 degits on your email tabaiiyadh317@gmail.com</p>
            </div>
            <form className="auth-form">
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
                <button type="submit" className="auth-button" disabled={loading} onClick={handleVerfiy}>{loading ? <Loader /> : "Verify"}</button>
            </form>
        </div>}
        {verfied && <div className="generic-container">
            <div className="auth-header">
                <h1>Edit E-mail</h1>
                <p>You can change your E-mail any time</p>
            </div>
            <form className="auth-form" ref={formRef} onSubmit={(e) => handleSubmit(e)} >
                <div className="form-group">
                    <label htmlFor="email">New E-mail</label>
                    <input id="email" name="email" type="email" placeholder="Enter new email" disabled={loading} required />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> : "Change E-mail"}</button>
            </form>
        </div>}
    </>
    )
}

export default EditEmail;