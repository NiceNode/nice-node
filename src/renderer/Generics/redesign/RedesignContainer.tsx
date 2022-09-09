import { useState } from 'react';
import { darkTheme, lightTheme } from './theme.css';

const RedesignContainerStoryBook = ({ children }: any) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div>
      <p>Toggle dark mode</p>
      <button
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
/* Shape */
