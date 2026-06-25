import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chatapp-language';

const Language = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const resetToDefault = () => {
    setLanguage('en');
  };

  return (
    <div className='language-container'>
      <h2>Language Settings</h2>
        <p>Choose your preferred language for the application.</p>
        <div className='language-options'>
            <div className='option'>
                <label htmlFor='language'>Language:</label>
                <select id='language' value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value='en'>English</option>
                <option value='fr'>French</option>
                <option value='es'>Spanish</option>
                <option value='de'>German</option>
                <option value='zh'>Chinese</option>
                <option value='ar'>Arabic</option>
                <option value='ru'>Russian</option>
                </select>
            </div>
        </div>
        <div className='language-actions'>
            <button className='save-button' onClick={() => localStorage.setItem(STORAGE_KEY, language)}>Save Changes</button>
            <button className='reset-button' onClick={resetToDefault}>Reset to Default</button>
        </div>
    </div>
  );
}

export default Language;
