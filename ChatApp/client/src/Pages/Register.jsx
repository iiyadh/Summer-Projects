import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useLoadingStore } from '../store/loadingStore';
import { useAuthStore } from '../store/authStore';
import  Loader from '../effects/Loader';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const fromRef = useRef();
    const { loading, show, hide } = useLoadingStore();
    const { register } = useAuthStore();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData(fromRef.current);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('pass'),
        }

        if(data.password !== formData.get('Cpass')) {
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
            toast.error("Week Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        try{
            show();
            const res = await register(data);
            console.log(res);
            hide();
            if(res.success) {
                toast.success("Account created successfully", {
                    duration: 2500,
                    removeDelay: 500,
                });
                navigate('/login');
            } else {
                toast.error(res.error, {
                    duration: 2500,
                    removeDelay: 500,
                });
            }
        }catch(error) {
            hide();
            toast.error("Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Sign up to get started with Chat App</p>
                </div>
                <form className="auth-form" ref={fromRef} onSubmit={(e)=>handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" placeholder="Choose a username" disabled={loading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter your email" disabled={loading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Password</label>
                        <input id="pass" type="password" name="pass" placeholder="Create a password" disabled={loading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Cpass">Confirm Password</label>
                        <input id="Cpass" type="password" name="Cpass" placeholder="Confirm your password" disabled={loading} required />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> : "Create Account"}</button>
                </form>
                <div className="auth-link">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;