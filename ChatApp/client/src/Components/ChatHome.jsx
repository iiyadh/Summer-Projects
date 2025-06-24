const ChatHome = () => {
  return (
    <div className="chathome-container">
      <div className="welcome-content">
        <div className="welcome-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h1 className="welcome-title">Welcome!</h1>
        <p className="welcome-subtitle">Select a chat to start messaging.</p>
        <div className="decorative-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      
      <style jsx>{`
        .chathome-container {
          display: grid;
          width: 100%;
          height: 100%;
          place-content: center;
          background: #f0f0f0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(3, 166, 161, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(3, 166, 161, 0.03) 0%, transparent 50%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .chathome-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 49%, rgba(3, 166, 161, 0.02) 50%, transparent 51%);
          pointer-events: none;
        }

        .welcome-content {
          text-align: center;
          z-index: 1;
          position: relative;
          animation: fadeInUp 0.8s ease-out;
          max-width: 600px;
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          color: #03a6a1;
          opacity: 0;
          animation: iconFloat 0.8s ease-out 0.3s forwards;
          background: rgba(3, 166, 161, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(3, 166, 161, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .welcome-icon:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(3, 166, 161, 0.2);
          border-color: rgba(3, 166, 161, 0.4);
        }

        .welcome-icon svg {
          width: 40px;
          height: 40px;
        }

        .welcome-title {
          font-size: 3.5rem;
          color: #03a6a1;
          font-weight: 700;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          opacity: 0;
          animation: slideInLeft 0.8s ease-out 0.5s forwards;
          background: linear-gradient(135deg, #03a6a1, #02928e);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(3, 166, 161, 0.1);
        }

        .welcome-subtitle {
          font-size: 1.4rem;
          color: #03a6a1;
          font-weight: 500;
          margin: 0 0 2rem;
          opacity: 0.85;
          animation: slideInRight 0.8s ease-out 0.7s forwards;
          letter-spacing: 0.01em;
          line-height: 1.4;
        }

        .decorative-dots {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 2rem;
          opacity: 0;
          animation: fadeIn 0.8s ease-out 1s forwards;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #03a6a1;
          animation: pulse 2s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconFloat {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: 2.5rem;
          }
          
          .welcome-subtitle {
            font-size: 1.1rem;
          }
          
          .welcome-icon {
            width: 60px;
            height: 60px;
          }
          
          .welcome-icon svg {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 480px) {
          .chathome-container {
            padding: 1rem;
          }
          
          .welcome-title {
            font-size: 2rem;
          }
          
          .welcome-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatHome;