import { useEffect, useRef, useState } from 'react';
import '../../styles/Popup.css'; 

const Popup = ({ children, onClose, spot }) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (spot && popupRef.current) {
      const dx = spot.x - window.innerWidth / 2;
      const dy = spot.y - window.innerHeight / 2;

      popupRef.current.style.setProperty('--spot-x', `${dx}px`);
      popupRef.current.style.setProperty('--spot-y', `${dy}px`);
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }
  }, [spot]);

  const handleClose = () => {
    if (popupRef.current) {
      popupRef.current.classList.remove('show-popup');
      popupRef.current.classList.add('hide-popup');
    }

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div ref={containerRef} className={`popup-container ${visible ? 'show' : ''}`}>
      <div
        ref={popupRef}
        className={`popup-content ${visible ? 'show-popup' : ''}`}
      >
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
