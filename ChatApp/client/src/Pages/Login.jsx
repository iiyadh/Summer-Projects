import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useRef } from 'react';
import { useLoadingStore } from '../store/loadingStore';
import  Loader  from '../effects/Loader';

const Login = () => {
    const { loading, show, hide } = useLoadingStore();
    const fromRef = useRef();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        show();
        setTimeout(() => {
            hide();
        }, 2000);
        const formData = new FormData(fromRef.current);
        const data = {
            email: formData.get('email'),
            password: formData.get('pass'),
        }
        console.log(data);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to Chat App</p>
                </div>
                <form className="auth-form" ref={fromRef} onSubmit={(e)=>handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="Enter your email" disabled={loading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Password</label>
                        <input id="pass" type="password" name="pass" placeholder="Enter your password" disabled={loading} required />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> : "Sign In"}</button>
                </form>
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