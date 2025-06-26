import Loader from "../../effects/Loader";
import { useRef } from 'react';
import "../../styles/Auth.css";
import { useLoadingStore } from "../../store/loadingStore";



const EditUsername = () => {
    const fromRef = useRef();
    const { loading, show, hide } = useLoadingStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(fromRef.current);
        const data = {
            username: formData.get('username'),
            password: formData.get('pass'),
        };
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
                <h1>Change Username</h1>
                <p>You can change your Username any time</p>
            </div>
            <form className="auth-form" ref={fromRef} onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="username">New Username</label>
                    <input id="username" name="username" type="text" placeholder="Enter new username" disabled={loading} required />
                </div>
                <div className="form-group">
                    <label htmlFor="pass">Password</label>
                    <input id="pass" type="password" name="pass" placeholder="Enter your password" disabled={loading} required />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>{loading ? <Loader /> : "Change Username"}</button>
            </form>
        </div>
    )
}

export default EditUsername;