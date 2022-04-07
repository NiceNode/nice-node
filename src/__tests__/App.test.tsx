import '@testing-library/jest-dom';
// import { render } from '@testing-library/react';
import { render } from './text-utils';

import App from '../renderer/App';

jest.mock('../renderer/electronGlobal');

jest.mock('@sentry/electron/renderer', () => {
  return {
    init: jest.fn(() => {
      return {};
    }),
  };
});

// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
