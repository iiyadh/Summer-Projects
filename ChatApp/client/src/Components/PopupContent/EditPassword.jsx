import { useRef } from 'react';
import "../../styles/Auth.css";
import { useLoadingStore } from "../../store/loadingStore";
import toast from 'react-hot-toast';



const EditPassword = () => {
    const fromRef = useRef();
    const { loading, show, hide } = useLoadingStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(fromRef.current);
        const data = {
            oldPassword: formData.get('Opass'),
            newPassword: formData.get('pass'),
        };
        
        if(data.newPassword !== formData.get('Cpass')) {
            toast.error("Passwords do not match",{
                duration: 2500,
                removeDelay:500,
            });
            return;
        }

        if(new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/).test(data.newPassword) === false) {
            toast.error("Weak Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        show();
        setTimeout(() => {
            hide();
            fromRef.current.reset();
            console.log(data);
        }, 2000);
    }

    return (
        <div className="generic-container">
            <div className="auth-header">
                <h1>Change Password</h1>
                <p>You can change your Password any time</p>
            </div>
            <form className="auth-form" ref={fromRef} onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="Opass">Old Password</label>
                    <input id="Opass" name="Opass" type="password" placeholder="Enter your old Password" disabled={loading} required />
                </div>
                <div className="form-group">
                    <label htmlFor="pass">New Password</label>
                    <input id="pass" name="pass" type="password" placeholder="Enter new Password" disabled={loading} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Cpass">Confirm Password</label>
                    <input id="Cpass" type="password" name="Cpass" placeholder="Confirm your password" disabled={loading} required />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>{loading ? "..." : "Change Password"}</button>
            </form>
        </div>
    )
}

export default EditPassword;