import http from 'node:http';
import https from 'node:https';

export const httpGet = (url: string): Promise<http.IncomingMessage> => {
  return new Promise((resolve, reject) => {
    try {
      const request = https.request(url, (response: http.IncomingMessage) => {
        resolve(response);
      });
      request.on('error', (err) => {
        console.error('https request: ', err);
      });
      request.end();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
