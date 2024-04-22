import path from 'node:path';
import { URL } from 'node:url';
import url from 'node:url';

export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export function resolveHtmlPath(htmlFileName: string) {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    const url = new URL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/${htmlFileName}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.join(
    __dirname,
    `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html?${htmlFileName}`,
  )}`;
}
