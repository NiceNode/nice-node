import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './state/store';
// import i18n (needs to be bundled)
import './i18n';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
