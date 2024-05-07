/* global $ */
import { expect } from '@wdio/globals';
import { browser } from 'wdio-electron-service';

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
});

describe('App build property tests', () => {
  // More Electron api test examples
  // https://github.com/webdriverio-community/wdio-electron-service/blob/main/docs/electron-apis/mocking-apis.md
  it('app name should be set', async () => {
    expect(await browser.electron.execute((electron) => {
      return electron.app.getName();
    })).toEqual('NiceNode');
  });

  it('app version should be set and greater than 6.0.0', async () => {
    expect(await browser.electron.execute((electron) => {
      return electron.app.getVersion();
    })).toBeDefined();
    expect(await browser.electron.execute((electron) => {
      return electron.app.getVersion();
    }) > '6.0.0').toBeTruthy();
  });

  it('app menu should be contain NiceNode and Help', async () => {
    const isNiceNodeMenuItemExists = await browser.electron.execute((electron) => {
      // console.log('menu', electron.app.applicationMenu)
      return electron.app.applicationMenu.items.some((item) => {
        // console.log('item', item)
        return item.label === 'NiceNode';
      });
    })
    expect(isNiceNodeMenuItemExists).toBeTruthy();
    const isHelpMenuItemExists = await browser.electron.execute((electron) => {
      // console.log('menu', electron.app.applicationMenu)
      return electron.app.applicationMenu.items.some((item) => {
        // console.log('item', item)
        return item.label === 'Help';
      });
    })
    expect(isHelpMenuItemExists).toBeTruthy();
  });

  it('logs dir path should contain logs', async () => {
    expect(await browser.electron.execute((electron) => {
      return electron.app.getPath('logs');
    })).toContain('logs');
  });
});
