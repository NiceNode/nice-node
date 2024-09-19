import os from 'node:os';
/* global $ */
import { expect } from '@wdio/globals';
import { browser } from 'wdio-electron-service';
import { execSync } from 'node:child_process';

// mock('../src/main/execHelper.js', () => {
//   return {
//     execAwait: vi.fn((command: string) => {
//       return execSync(command);
//     }),
//   };
// });

describe('Splash screen tests', () => {
  it('application should open to splash screen with welcome message', async () => {
    const elWelcome = await $('#welcome');
    await expect(elWelcome).toBeDisplayed();
    await expect(elWelcome).toHaveText(expect.stringContaining('NiceNode'));
    await browser.pause(4000);
  });

  it('clicking get started btn should take the user to add node screen', async () => {
    await $('#getStartedBtn').click();
    const elAddFirstNodeTitle = await $('#addFirstNodeTitle');
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Add your first node');
    await browser.pause(4000);
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
    const elAddFirstNodeTitle = await $('#launchAVarNodeTitle');
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Launch a Ethereum Node');
    await browser.pause(2000);
  });

  it('clicking continue btn should take the user to service and node requirements screen', async () => {
    await $('#stepperNextButton').click();
    const elAddFirstNodeTitle = await $('#nodeRequirementsTitle');
    await expect(elAddFirstNodeTitle).toBeDisplayed();
    await expect(elAddFirstNodeTitle).toHaveText('Node Requirements');
    await browser.pause(6000);
  });

  let isPodmanIsInstalled = false;
  // from splash screen, we always show podman screen
  it('clicking continue btn should take the user to Podman installation screen', async () => {
    await $('#stepperNextButton').click();
    await browser.pause(3000);
    const startNodeBtn = await $('#stepperNextButton');
    const elPodmanInstallationTitle = await $('#podmanInstallationTitle');
    await expect(elPodmanInstallationTitle).toBeDisplayed();
    await expect(elPodmanInstallationTitle).toHaveText('Podman installation');
    if ((await startNodeBtn.getAttribute('disabled')) === 'true') {
      // install and or start podman
      // const elPodmanInstallationTitle = await $("#podmanInstallationTitle");
      // await expect(elPodmanInstallationTitle).toBeDisplayed();
      // await expect(elPodmanInstallationTitle).toHaveText('Podman installation');
    } else {
      // if enabled, start node
      // await browser.pause(2000);
      // const elPodmanInstallCompleteTitle = await $("#podmanInstallCompleteTitle");
      // await expect(elPodmanInstallCompleteTitle).toBeDisplayed();
      // await expect(elPodmanInstallCompleteTitle).toHaveText('Podman installed');
      isPodmanIsInstalled = true;
    }
  });

  // todo: fix these tests so they can successfully run within a container
  // uncomment to run locally
  // process.env.CI = 'true';
  // || (os.platform() === 'darwin' && process.env.CI === 'true')
  if (os.platform() === 'linux') {
    // from splash screen, we always show podman screen
    it('clicking continue btn should add and start the node', async () => {
      await browser.pause(2000);
      if (!isPodmanIsInstalled) {
        // click install and or start podman button
        try {
          if ($('#downloadAndInstallPodmanBtn').isDisplayed()) {
            await $('#downloadAndInstallPodmanBtn').click();
            const startNodeBtn = await $('#stepperNextButton');
            await browser.pause(30000); // pauses 30 seconds before checking if podman installed
            // biome-ignore lint/complexity/useArrowFunction: <explanation>
            await browser.waitUntil(
              async function () {
                const elPodmanInstallCompleteTitle = await $(
                  '#podmanInstallCompleteTitle',
                );
                return elPodmanInstallCompleteTitle.isDisplayed();
              },
              { timeout: 300000 },
            ); // allow 5 min for podman install
            // start podman may not be shown, should be done automatically, and it is now that NN tries to start on startup
            // await browser.waitUntil(async () => {
            //   return (await startNodeBtn.getAttribute('disabled') !== 'true')
            // })
            // await browser.pause(50000);
          }
        } catch (e) {
          console.log(
            'no download and install button, moving on to start podman',
          );
        }

        // if((await $('#startPodmanBtn')).isDisplayed()) {
        //   await $('#startPodmanBtn').click();
        //   // await browser.pause(50000);
        // }
        // todo: wait for next button to be enabled?
      }
      await $('#stepperNextButton').click();
      await browser.pause(2000);
    }).timeout(120000); // wait 3 minutes for the podman to download (& start)

    it('Ethereum Node screen should be displayed with starting and starting... btn', async () => {
      await expect(await $('div*=Ethereum Node')).toBeDisplayed();
      await expect(await $('div*=Starting')).toBeDisplayed();
      await expect(await $('span*=Starting...')).toBeDisplayed();
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('clicking stop node btn should stop the node and show resume button', async () => {
      // Stop doesn't show until the containers have downloaded. This is why we need to wait longer.
      await $('span*=Stop').waitForExist({ timeout: 240000 }); // default wait time is only 5 seconds
      const stopBtn = (await $('span*=Stop')).parentElement();
      (await stopBtn).click();
      // await browser.pause(15000);
      // await expect(await $('div*=Stopping')).toBeDisplayed();
      // ...
      await expect(await $('div*=Stopped')).toBeDisplayed();
      await expect(await $('span*=Resume')).toBeDisplayed();
      // await browser.pause(15000);
      // await browser.pause(2000);
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
      // await expect(await $('div*=')).toBeDisplayed();
    }).timeout(240000); // wait 6 minutes for the node to download & start
  }
});

describe('App build property tests', () => {
  // More Electron api test examples
  // https://github.com/webdriverio-community/wdio-electron-service/blob/main/docs/electron-apis/mocking-apis.md
  it('app name should be set', async () => {
    expect(
      await browser.electron.execute((electron) => {
        return electron.app.getName();
      }),
    ).toEqual('NiceNode');
  });

  it('app version should be set and greater than 6.0.0', async () => {
    expect(
      await browser.electron.execute((electron) => {
        return electron.app.getVersion();
      }),
    ).toBeDefined();
    expect(
      (await browser.electron.execute((electron) => {
        return electron.app.getVersion();
      })) > '6.0.0',
    ).toBeTruthy();
  });

  it('app menu should be contain NiceNode and Help', async () => {
    const isNiceNodeMenuItemExists = await browser.electron.execute(
      (electron) => {
        // console.log('menu', electron.app.applicationMenu)
        return electron.app.applicationMenu.items.some((item) => {
          // console.log('item', item)
          return item.label === 'NiceNode';
        });
      },
    );
    expect(isNiceNodeMenuItemExists).toBeTruthy();
    const isHelpMenuItemExists = await browser.electron.execute((electron) => {
      // console.log('menu', electron.app.applicationMenu)
      return electron.app.applicationMenu.items.some((item) => {
        // console.log('item', item)
        return item.label === 'Help';
      });
    });
    expect(isHelpMenuItemExists).toBeTruthy();
  });

  it('logs dir path should contain logs', async () => {
    expect(
      await browser.electron.execute((electron) => {
        return electron.app.getPath('logs');
      }),
    ).toContain('logs');
  });
});
