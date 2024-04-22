import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import '../../i18n';
import '../../reset.css';
import './globalStyle.css';

import { store } from '../../state/store';

import StorybookLanguageSelect from '../../Presentational/StorybookLanguageSelect';
import Button from './Button/Button';
import { darkTheme, lightTheme, vars } from './theme.css';

const RedesignContainerStoryBook = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <Provider store={store}>
      <div
        id="onBoarding"
        className={isDarkTheme ? darkTheme : lightTheme}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
          background: vars.color.background,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 20,
          }}
        >
          <div>
            <p>Toggle dark mode</p>
            <Button
              label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
              onClick={() =>
                setIsDarkTheme((currentValue: boolean) => !currentValue)
              }
            />
          </div>
          <div style={{ minWidth: 150 }}>
            <StorybookLanguageSelect />
          </div>
        </div>
        <div
          style={{
            marginTop: '1em',
            border: '1px dashed',
            borderColor: vars.color.font10,
            flexGrow: 1,
            overflow: 'auto',
            padding: 30,
            /**
             * Then, because flex items cannot be smaller than the
             * size of their content – min-height: auto is the
             * default – add min-height: 0 to allow the item to
             * shrink to fit inside the container.
             * https://stackoverflow.com/questions/41674979/flex-child-is-growing-out-of-parent
             */
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </div>
    </Provider>
  );
};
export default RedesignContainerStoryBook;
