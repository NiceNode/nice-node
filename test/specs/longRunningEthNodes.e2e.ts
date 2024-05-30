import os from 'node:os';
/* global $ */
import { expect } from '@wdio/globals';
import { browser } from 'wdio-electron-service';
// import { removeAllNodePackages } from '../../src/main/nodePackageManager.js';
import { afterAll } from 'vitest';


// const cleanup =  async () => {
//   // remove all nodes and delete their data
//   await removeAllNodePackages();
// }
const addNode = async () => {
  describe('Should pass all of the eth node successfully starts syncing tests:', async () => {

    it('Add Ethereum Node with specific clients', async () => {


    // start add node cycle from add node modal
  // span Add Node.click
  // span Continue.click
  // div Nethermind.click
  // (div id=react-select-5-option-1).click() role=option or ... div Besu.click()?

      await expect(await $('span*=Add Node')).toBeDisplayed();
      await $('span*=Add Node').click();
      await expect(await $('span*=Continue')).toBeDisplayed();
      await $('span*=Continue').click();
      // await expect(await $('div*=Nethermind')).toBeDisplayed();
      await $('div*=Nethermind').click();
      await $('div*=Besu').click();
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('Ethereum Node should have all hardware statistic usage > 0', async () => {
      // wait 20 seconds for stats to be set
      const memUsageElement = await $('#memoryUsagePercentValue');
      const cpuLoadElement = await $('#cpuLoadValue');
      // const diskUsageElement = await $('#diskUsageGBsValue');
      await browser.waitUntil(async () => Number.parseFloat(await memUsageElement.getText()) > 1, {timeout: 30000});
      await browser.waitUntil(async () => Number.parseFloat(await cpuLoadElement.getText()) > 1, {timeout: 20000});
      // await browser.waitUntil(async () => {
      //   console.log("Waiting for disk usage to be > 1 GB...")
      //   return Number.parseFloat(await diskUsageElement.getText()) > 1
      // }, { timeout: 5*60*1000, interval: 15000 }); // give 5 minutes to download 1 GB
    }).timeout(10*60*1000); // 10 minutes

    it('clicking stop node btn should stop the node and show resume button', async () => {
      const stopBtn = (await $('span*=Stop')).parentElement();
      (await stopBtn).click();
      // can take an execution node ~30 seconds to fully stop
      await browser.pause(25000);
      // await expect(await $('div*=Stopping')).toBeDisplayed();
      // ...
      await expect(await $('div*=Stopped')).toBeDisplayed();
      await expect(await $('span*=Resume')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('clicking node package settings and remove node should show no active nodes', async () => {
      await $('#nodeSettingsBtn').click();
      const removeNodeBtn = (await $('div*=Remove Node')).parentElement();
      (await removeNodeBtn).click();
      // await $('#removeNodeMenuItem').click();
      const confirmRemoveNodeBtn = (await $('span*=Remove node')).parentElement();
      (await confirmRemoveNodeBtn).click();

      // No active nodes if there are no nodes... next click "Add Node" btn
      await expect(await $('div*=No active nodes')).toBeDisplayed();

      // await browser.pause(2000);
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
      // await expect(await $('div*=')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start
  });

  // afterAll(async () => {
  //   await cleanup();
  // });
}

const testsForEachNode = async () => {
  describe('Should pass all of the eth node successfully starts syncing tests:', async () => {

    it('Ethereum Node screen should be displayed with syncing and stop btn', async () => {
      await expect(await $('div*=Ethereum Node')).toBeDisplayed();
      await expect(await $('div*=Syncing')).toBeDisplayed();
      await expect(await $('span*=Stop')).toBeDisplayed();
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('Ethereum Node should have all hardware statistic usage > 0', async () => {
      // wait 20 seconds for stats to be set
      const memUsageElement = await $('#memoryUsagePercentValue');
      const cpuLoadElement = await $('#cpuLoadValue');
      const diskUsageElement = await $('#diskUsageGBsValue');
      await browser.waitUntil(async () => Number.parseFloat(await memUsageElement.getText()) > 1, {timeout: 30000});
      await browser.waitUntil(async () => Number.parseFloat(await cpuLoadElement.getText()) > 1, {timeout: 20000});
      await browser.waitUntil(async () => {
        console.log("Waiting for disk usage to be > 1 GB...")
        return Number.parseFloat(await diskUsageElement.getText()) > 1
      }, { timeout: 5*60*1000, interval: 15000 }); // give 5 minutes to download 1 GB
    }).timeout(10*60*1000); // 10 minutes

    it('clicking stop node btn should stop the node and show resume button', async () => {
      const stopBtn = (await $('span*=Stop')).parentElement();
      (await stopBtn).click();
      // can take an execution node ~30 seconds to fully stop
      await browser.pause(25000);
      // await expect(await $('div*=Stopping')).toBeDisplayed();
      // ...
      await expect(await $('div*=Stopped')).toBeDisplayed();
      await expect(await $('span*=Resume')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start

    it('clicking node package settings and remove node should show no active nodes', async () => {
      await $('#nodeSettingsBtn').click();
      const removeNodeBtn = (await $('div*=Remove Node')).parentElement();
      (await removeNodeBtn).click();
      // await $('#removeNodeMenuItem').click();
      const confirmRemoveNodeBtn = (await $('span*=Remove node')).parentElement();
      (await confirmRemoveNodeBtn).click();

      // No active nodes if there are no nodes... next click "Add Node" btn
      await expect(await $('div*=No active nodes')).toBeDisplayed();

      // await browser.pause(2000);
      // after docker containers are downloaded and the node is started, the node should be online
      // await expect(await $('div*=Online')).toBeDisplayed();
      // await expect(await $('div*=')).toBeDisplayed();
    }).timeout(120000); // wait 3 minutes for the node to download & start
  });

  // afterAll(async () => {
  //   await cleanup();
  // });
}

describe('Splash screen tests', async () => {
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

  // from splash screen, we always show podman screen
  it('clicking continue btn should take the user to Podman installation screen', async () => {
    await $('#stepperNextButton').click();
    await browser.pause(3000); // wait for podman is installed check to return to ui
    const elPodmanInstallationTitle = await $("#podmanInstallationTitle");
    await expect(elPodmanInstallationTitle).toBeDisplayed();
    await expect(elPodmanInstallationTitle).toHaveText('Podman installation');
  });

  // todo: fix these tests so they can successfully run within a container
  // uncomment to run locally
  // process.env.CI = 'true';
  // || (os.platform() === 'darwin' && process.env.CI === 'true')
  // if(os.platform() === 'linux') {
    // from splash screen, we always show podman screen
    it('clicking continue btn should add and start the node (node status not checked here)', async () => {
      await $('#stepperNextButton').click();
    }).timeout(120000); // wait 3 minutes for the podman to download (& start)

    // it('should pass all of the eth node successfully starts syncing tests:', async () => {
    // });
  // }
});


await testsForEachNode(); // run tests for first node selection from splash screen

await addNode(); // run tests for adding a node from the add node modal;

// setTimeout(() => {debugger;}, 5000);

