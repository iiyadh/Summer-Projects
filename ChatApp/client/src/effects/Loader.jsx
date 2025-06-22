const Loader = () => {
return (
    <>
        <style>{`
            .loader-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }
            
            .loader {
                border: 4px solid #f3f3f3;
                border-radius: 50%;
                border-top: 4px solid #03A6A1;
                width: 30px;
                height: 30px;
                animation: spin 2s linear infinite;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>

        <div className="loader-container">
            <div className="loader">
                <span></span>
            </div>
        </div>
    </>
);
};

export default Loader;