document.getElementById('applyTheme').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let theme = document.getElementById('themeSelect').value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (selectedTheme) => {
      const styleId = 'theme-extension-style';
      let existing = document.getElementById(styleId);
      if (existing) existing.remove();
      let style = document.createElement('style');
      style.id = styleId;

      const themes = {
      dark: `
        body, html {
          background-color: #121212 !important;
          color: #e0e0e0 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #e0e0e0 !important;
          border-color: #333 !important;
        }
      `,
      cyberpunk: `
        body, html {
          background-color: #000000 !important;
          color: #00ff00 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #00ff00 !important;
          border-color: #00ff00 !important;
        }
      `,
      ocean: `
        body, html {
          background-color: #1a374d !important;
          color: #b1d4e0 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #b1d4e0 !important;
          border-color: #406882 !important;
        }
      `,
      midnight: `
        body, html {
          background-color: #0a0e17 !important;
          color: #a0a8c0 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #a0a8c0 !important;
          border-color: #1e2a3a !important;
        }
      `,
      charcoal: `
        body, html {
          background-color: #1e1e1e !important;
          color: #d4d4d4 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #d4d4d4 !important;
          border-color: #3c3c3c !important;
        }
      `,
      amoled: `
        body, html {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #ffffff !important;
          border-color: #222222 !important;
        }
      `,
      dracula: `
        body, html {
          background-color: #282a36 !important;
          color: #f8f8f2 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #f8f8f2 !important;
          border-color: #44475a !important;
        }
      `,
      hacker: `
        body, html {
          background-color: #0a0a0a !important;
          color: #00ff00 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #00ff00 !important;
          border-color: #003300 !important;
        }
      `,
      deepspace: `
        body, html {
          background-color: #0f0f1a !important;
          color: #e0e0ff !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #e0e0ff !important;
          border-color: #2a2a4a !important;
        }
      `,
      obsidian: `
        body, html {
          background-color: #0b1219 !important;
          color: #c8d6e5 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #c8d6e5 !important;
          border-color: #1e2d3a !important;
        }
      `,
      matrix: `
        body, html {
          background-color: #000000 !important;
          color: #00cc00 !important;
        }
        *:not(img) {
          background-color: transparent !important;
          color: #00cc00 !important;
          border-color: #003300 !important;
        }
      `
    };

      style.textContent = themes[selectedTheme];
      document.head.appendChild(style);
    },
    args: [theme]
  });
});
