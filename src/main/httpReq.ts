import http from 'node:http';
import https from 'node:https';
import { parse } from 'node:path';

import logger from './logger';

export const httpGet = (
  url: string,
  isHttp?: boolean
): Promise<http.IncomingMessage> => {
  return new Promise((resolve, reject) => {
    try {
      let request;
      if (!isHttp) {
        request = https.request(url, (response: http.IncomingMessage) => {
          resolve(response);
        });
      } else {
        request = http.request(url, (response: http.IncomingMessage) => {
          resolve(response);
        });
      }
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
): Promise<http.IncomingMessage> => {
  const response = await httpGet(url, isHttp);

  return new Promise((resolve, reject) => {
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', async () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        resolve(parsedData);
      } catch (err) {
        reject(err);
      }
    });
  });
};
