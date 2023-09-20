const Store = require('electron-store');

const store = new Store();

export const setIsStartOnLogin = (isStartOnLogin: boolean): void => {
  store.set('isStartOnLogin', isStartOnLogin);
};

export const getIsStartOnLogin = (): boolean => {
  return store.get('isStartOnLogin');
};

export const watchIsStartOnLogin = (handler: () => void): void => {
  store.onDidChange('isStartOnLogin', handler);
};

export default store;
