import { BrowserWindow } from 'electron';

export const setCorsForNiceNode = (mainWindow: BrowserWindow) => {
  // [Start] Modifies the renderer's Origin header for all outgoing web requests.
  // This is done to simplify the allowed origins set for geth
  const filter = {
    urls: ['http://localhost/*', 'ws://localhost/', 'http://localhost:*/*'], // Remote API URS for which you are getting CORS error
  };
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders.Origin = `http://localhost`;
      callback({ requestHeaders: details.requestHeaders });
    },
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      if (!details.responseHeaders) {
        details.responseHeaders = {};
      }

      details.responseHeaders['Access-Control-Allow-Headers'] = ['*'];
      details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
      // Some api servers use lower-case.
      //  Chrome will combine both headers and throw a CORS error for having 2 values.
      //  So just delete the lower-case value
      delete details.responseHeaders['access-control-allow-origin'];

      callback({ responseHeaders: details.responseHeaders });
    },
  );
  // [End] modifying Origin header
};
