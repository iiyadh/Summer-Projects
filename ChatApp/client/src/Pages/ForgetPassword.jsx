import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useRef } from 'react';
import { useLoadingStore } from '../store/loadingStore';
import  Loader  from '../effects/Loader';


const ForgetPassword = () => {
    const { loading, show, hide } = useLoadingStore();
    const fromRef = useRef();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        show();
        setTimeout(() => {
            hide();
        }, 2000);
        const formData = new FormData(fromRef.current);
        const email = formData.get('email');
        console.log("Reset link sent to:", email);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>
                <form className="auth-form" ref={fromRef} onSubmit={(e)=>handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name='email' placeholder="Enter your email" disabled={loading} required />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> :"Send Reset Link"}</button>
                </form>
                <div className="auth-link">
                    <p>Remember your password? <Link to="/login">Back to Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;