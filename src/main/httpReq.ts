import http from 'node:http';
import https from 'node:https';

import logger from './logger';

export const httpGet = (
  url: string,
  options?: {
    headers?: { name: string; value: string }[];
    isHttp?: boolean;
  }
): Promise<http.IncomingMessage> => {
  return new Promise((resolve, reject) => {
    try {
      let request: http.ClientRequest;
      if (!options?.isHttp) {
        request = https.request(url, (response: http.IncomingMessage) => {
          // follow github release redirects
          if (response.statusCode === 302 && response.headers.location) {
            resolve(httpGet(response.headers.location, options));
          }
          resolve(response);
        });
      } else {
        request = http.request(url, (response: http.IncomingMessage) => {
          if (response.statusCode === 302 && response.headers.location) {
            resolve(httpGet(response.headers.location, options));
          }
          resolve(response);
        });
      }
      if (Array.isArray(options?.headers)) {
        options?.headers.forEach((header) => {
          request.setHeader(header.name, header.value);
        });
      }
      request.setHeader(
        'User-Agent',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Safari/537.36'
      );
      request.on('error', (err) => {
        logger.error('https request: ', err);
      });
      request.end();
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });
};

export const httpGetJson = async (
  url: string,
  isHttp?: boolean
): Promise<any> => {
  const response = await httpGet(url, isHttp);

  return new Promise((resolve, reject) => {
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', async () => {
      try {
        const parsedData = JSON.parse(rawData);
        resolve(parsedData);
      } catch (err) {
        logger.error(`JSON.parse error: `, err);
        reject(err);
      }
    });
  });
};
