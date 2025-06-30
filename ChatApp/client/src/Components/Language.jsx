const Language = () => {
  return (
    <div className='language-container'>
      <h2>Language Settings</h2>
        <p>Choose your preferred language for the application.</p>
        <div className='language-options'>
            <div className='option'>
                <label htmlFor='language'>Language:</label>
                <select id='language'>
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
            <button className='save-button'>Save Changes</button>
            <button className='reset-button'>Reset to Default</button>
        </div>
    </div>
  );
}

export default Language;