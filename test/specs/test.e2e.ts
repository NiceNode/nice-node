/* global $ */
import { browser } from '@wdio/globals';

// import * as i18nMain from '../../src/main/i18nMain';
// i18nMain.initialize();

// const t = i18nMain.i18nMain.getFixedT(null, 'translation');
process.env.LANG = 'en_US.UTF-8';

describe('Electron Testing', () => {
  before(function () {
    // Save the old value if necessary
    // this.oldValue = process.env.MY_VARIABLE;

    // // Set the variable for this block
    // process.env.MY_VARIABLE = 'new value';
    console.log('process.env.LANG: ', process.env.LANG);
    process.env.LANG = 'en_US.UTF-8';
  });

  after(function () {
    // Reset the variable to its original value or clear it
    // if (this.oldValue) {
    //   process.env.MY_VARIABLE = this.oldValue;
    // } else {
    //   delete process.env.MY_VARIABLE;
    // }
    console.log('process.env.LANG: ', process.env.LANG);
    process.env.LANG = 'en_US.UTF-8';
  });

  it('application should open to splash screen with welcome message', async () => {
    console.log('Hello', await browser.getTitle(), 'application!');
    // Fails if your language is set to anything other than English
    await expect($('#welcome')).toHaveText('Welcome to NiceNode');
    // await expect($('#welcome')).toHaveText('Bienvenido a NiceNode');
    // await expect($('#welcome')).toHaveText(t('WelcomeToNiceNode'));
  });

  // it('app name should have nicenice', async () => {
  //   const appName = await browser.electron.get('appName');

  //   // Fails if your language is set to anything other than English
  //   await expect(appName).toEqual('NiceNode');
  //   // await expect($('#welcome')).toHaveText('Bienvenido a NiceNode');
  //   // await expect($('#welcome')).toHaveText(t('WelcomeToNiceNode'));
  // });
});
