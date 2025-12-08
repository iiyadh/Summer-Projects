
import { useRef } from 'react';
import "../../styles/Auth.css";
import { useLoadingStore } from "../../store/loadingStore";



const EditBio = () => {
    const formRef = useRef();
    const { loading, show, hide } = useLoadingStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            bio: formData.get('bio'),
        };
        show();
        setTimeout(() => {
            hide();
            formRef.current.reset();
            console.log(data);
        }, 2000);
    }

    return (
        <div className="generic-container">
            <div className="auth-header">
                <h1>Edit Biography</h1>
                <p>You can change your Biography any time</p>
            </div>
            <form className="auth-form" ref={formRef} onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="bio">New Username</label>
                    <textarea id="bio" name="bio" type="text" placeholder="Enter new Bio" disabled={loading} required rows="4"></textarea>
                </div>
                <button type="submit" className="auth-button" disabled={loading}>{loading ? "..." : "Edit Biography"}</button>
            </form>
        </div>
    )
}

export default EditBio;