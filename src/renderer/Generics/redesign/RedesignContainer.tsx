import React, { useState } from 'react';
import { darkTheme, lightTheme } from './theme.css';

const RedesignContainerStoryBook: React.FC = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div>
      <p>Toggle dark mode</p>
      <button
        type="button"
        onClick={() => setIsDarkTheme((currentValue: boolean) => !currentValue)}
      >
        Switch to {isDarkTheme ? 'light' : 'dark'} theme
      </button>
      <div
        id="onBoarding"
        className={isDarkTheme ? darkTheme : lightTheme}
        style={{ padding: '2em', border: '1px solid black' }}
      >
        {children}
      </div>
    </div>
  );
};
export default RedesignContainerStoryBook;
