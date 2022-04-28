import { BrowserWindow } from 'electron';

export const setCorsForNiceNode = (mainWindow: BrowserWindow) => {
  // [Start] Modifies the renderer's Origin header for all outgoing web requests.
  // This is done to simplify the allowed origins set for geth
  const filter = {
    urls: ['http://localhost/*', 'ws://localhost/'], // Remote API URS for which you are getting CORS error
  };
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders.Origin = `nice-node://`;
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      if (!details.responseHeaders) {
        details.responseHeaders = {};
      }

      details.responseHeaders['Access-Control-Allow-Origin'] = [
        '*',
        // 'http://localhost:1212', // URL your local electron app hosted
      ];

      callback({ responseHeaders: details.responseHeaders });
    }
  );
  // [End] modifying Origin header
};
