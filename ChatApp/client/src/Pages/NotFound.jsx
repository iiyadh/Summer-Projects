import { Link } from "react-router-dom";
import '../styles/Auth.css';

const NotFound = () => {
    return (
        <div className="auth-container">
            <div className="auth-card not-found">
                <h1>404</h1>
                <p>Oops! The page you are looking for does not exist.</p>
                <Link to="/">Return to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;