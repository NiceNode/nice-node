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

  it('clicking continue btn should take the user to service and initial node settings screen', async () => {
    // await browser.pause(3000);
    // await $('#getStartedBtn').click();
    // await browser.pause(3000);
    const alphaModalBtn = (await $('span*=I Understand')).parentElement();
    await expect(alphaModalBtn).toBeDisplayed();
    await alphaModalBtn.click();
    await browser.pause(3000);
    await $('#stepperNextButton').click();
    const elAddFirstNodeTitle = await $("#launchAVarNodeTitle");
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Launch a Ethereum Node');
  });

  it('clicking continue btn should take the user to service and node requirements screen', async () => {
    await $('#stepperNextButton').click();
    const elAddFirstNodeTitle = await $("#nodeRequirementsTitle");
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Node Requirements');
  });

  // let isPodmanIsInstalled = false;
  // from splash screen, we always show podman screen
  it('clicking continue btn should take the user to service and node requirements screen', async () => {
    await $('#stepperNextButton').click();
    try {
      // will not be displayed if podman is already installed
      const elPodmanInstallationTitle = await $("#podmanInstallationTitle");
      await expect(elPodmanInstallationTitle).toBeDisplayed();
      await expect(elPodmanInstallationTitle).toHaveText('Podman installation');
    } catch(e) {
      const elPodmanInstallCompleteTitle = await $("#podmanInstallCompleteTitle");
      await expect(elPodmanInstallCompleteTitle).toBeDisplayed();
      await expect(elPodmanInstallCompleteTitle).toHaveText('Podman installed');
      // isPodmanIsInstalled = true;
    }
  });

  // add if isPodmanIsInstalled, to run locally
  if(process.env.OS === 'linux' || (process.env.OS === 'darwin' && process.env.CI === 'true')) {
    // from splash screen, we always show podman screen
    it('clicking continue btn should add and start the node', async () => {
      await browser.pause(2000);
      await $('#stepperNextButton').click();
      await browser.pause(2000);
      // ...
      await expect(await $('div*=Ethereum Node')).toBeDisplayed();
      await expect(await $('div*=Syncing')).toBeDisplayed();
      await expect(await $('span*=Stop')).toBeDisplayed();
      // await browser.pause(2000);
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
      // await expect(await $('div*=')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('clicking continue btn should add and start the node', async () => {
      const stopBtn = (await $('span*=Stop')).parentElement();
      (await stopBtn).click();
      // await expect(await $('div*=Stopping')).toBeDisplayed();
      // ...
      await expect(await $('div*=Stopped')).toBeDisplayed();
      await expect(await $('span*=Resume')).toBeDisplayed();
      // await browser.pause(2000);
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
      // await expect(await $('div*=')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start
  }

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
