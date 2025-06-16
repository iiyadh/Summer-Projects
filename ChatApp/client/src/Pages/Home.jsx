import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Connect Instantly with <span className="highlight">ChatApp</span></h1>
                    <p>Your one-stop solution for seamless communication in a modern world</p>
                    <div className="cta-buttons">
                        <a href="/register" className="primary-button">Create Account</a>
                        <a href="/login" className="secondary-button">Get Started</a>
                    </div>
                </div>
            </div>
            
            <div id="features" className="features-section">
                <h2>Why Choose <span className="highlight">ChatApp</span>?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="feature-icon secure"></div>
                        <h3>Secure Messaging</h3>
                        <p>End-to-end encryption keeps your conversations private and secure</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon realtime"></div>
                        <h3>Real-time Chat</h3>
                        <p>Instant message delivery for smooth conversations</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon groups"></div>
                        <h3>Group Chats</h3>
                        <p>Create groups for team collaboration or friend circles</p>
                    </div>
                </div>
            </div>
            
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;