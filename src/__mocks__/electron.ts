import path from 'path';

// const electron = jest.createMockFromModule('electron').default;
const electron: jest.Mocked<typeof import('electron')> =
  jest.createMockFromModule('electron');

console.log('electron', electron);

const getPath = (pathName: string): string => {
  console.log('getPath dirname: ', __dirname);
  if (pathName === 'userData') {
    return __dirname;
  }
  if (pathName === 'appData') {
    return path.join(__dirname, 'NiceNode');
  }
  return __dirname;
};

electron.app.getPath = getPath;
