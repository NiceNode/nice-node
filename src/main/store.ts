const Store = require('electron-store');

export const store = new Store();

export const setIsStartOnLogin = (isStartOnLogin: boolean): void => {
  store.set('isStartOnLogin', isStartOnLogin);
};

export const getIsStartOnLogin = (): boolean => {
  return store.get('isStartOnLogin');
};

export const watchIsStartOnLogin = (
  handler: (isStartOnLogin: boolean) => void
): void => {
  store.onDidChange('isStartOnLogin', handler);
};
