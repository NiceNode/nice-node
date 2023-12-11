/* global $ */
import { browser } from '@wdio/globals';

// import * as i18nMain from '../../src/main/i18nMain';
// i18nMain.initialize();

// const t = i18nMain.i18nMain.getFixedT(null, 'translation');

describe('Electron Testing', () => {
  it('should print application title', async () => {
    console.log('Hello', await browser.getTitle(), 'application!');
    // Fails if your language is set to anything other than English
    await expect($('#welcome')).toHaveText('Welcome to NiceNode');
    // await expect($('#welcome')).toHaveText('Bienvenido a NiceNode');
    // await expect($('#welcome')).toHaveText(t('WelcomeToNiceNode'));
  });
});
