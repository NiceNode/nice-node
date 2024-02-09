/* global $ */
import { expect } from '@wdio/globals';
// import { browser } from 'wdio-electron-service';

describe('Splash screen tests', () => {
  it('application should open to splash screen with welcome message', async () => {
    const elWelcome = await $('#welcome');
    await expect(elWelcome).toBeDisplayed();
    await expect(elWelcome).toHaveText(expect.stringContaining('NiceNode'));
  });

  it('clicking get started btn should take the user to add node screen', async () => {
    await $('#getStartedBtn').click();
    const elAddFirstNodeTitle = await $('#addFirstNodeTitle');
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Add your first node');
  });

  // todo: when moving from require to imports
  // it('app name should be set', async () => {
  //   await browser.electron.execute(async (electron) => {
  //     const appName = await electron.app.getName();
  //     await expect(appName).toEqual('NiceNode');
  //   });
  // });
});
