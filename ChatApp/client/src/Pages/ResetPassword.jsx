import '../styles/Auth.css';
import { useParams ,useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useLoadingStore } from '../store/loadingStore';
import  Loader  from '../effects/Loader';
import api from '../api/api';


const ResetPassword = () => {
    const { loading, show, hide } = useLoadingStore();
    const fromRef = useRef();
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(token.length);
        if (token.length !== 64) {
            toast.error("Invalid Token", {
                duration: 2500,
                removeDelay: 500,
            });
            navigate('/login');
            return;
        }
    },[]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData(fromRef.current);
        const newPassword = formData.get('password');
        
        if(new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/).test(newPassword) === false) {
            toast.error("Weak Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        if(newPassword !== formData.get('Cpassword')) {
            toast.error("Passwords do not match", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        try{
            show();
            const res = await api.post(`/recovery/reset/${token}`,{ newPassword });
            if(res.status === 200){
                hide();
                toast.success(res.data.message, {
                    duration: 2500,
                    removeDelay: 500,
                });
                fromRef.current.reset();
                navigate('/login');
            }
        }catch(err){
            hide();
            toast.error(err.response?.data?.message || "Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Change Password</h1>
                    <p>Enter your new password below</p>
                </div>
                <form className="auth-form" ref={fromRef} onSubmit={(e)=>handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="pass">New Password</label>
                        <input id="pass" type="password" name='password' disabled={loading}  required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Cpass">Confirme Password</label>
                        <input id="Cpass" type="password" name='Cpassword' disabled={loading} required />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> : "Reset Password"}</button>
                </form>
            </div>
        </div>
    );
}


export default ResetPassword;
