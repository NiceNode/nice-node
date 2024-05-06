import { execSync } from 'node:child_process';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { isLinux } from '../../main/platform.js';
import {
  PODMAN_MIN_VERSION,
  getInstalledPodmanVersion,
} from '../../main/podman/install/install.js';
// import installPodman from '../../main/podman/install/install.js';
import installOnLinux from '../../main/podman/install/installOnLinux.js';
import uninstallOnLinux from '../../main/podman/uninstall/uninstallOnLinux.js';

beforeAll(async () => {
  // called once before all tests run
  if (!isLinux()) {
    throw new Error('This test suite is only for Linux');
  }

  vi.mock('../../main/logger.js', () => {
    return {
      default: {
        info: vi.fn((msg: string) => {
          console.log(msg);
        }),
        error: vi.fn((msg: string) => {
          console.log(msg);
        }),
      },
      autoUpdateLogger: vi.fn(),
    };
  });

  vi.mock('../../main/execHelper.js', () => {
    return {
      execAwait: vi.fn((command: string) => {
        return execSync(command);
      }),
    };
  });

  vi.mock('electron', () => {
    return {
      app: {
        getAppPath: vi.fn(() => {
          return '/we/out/here/nice-node';
        }),
        getPath: vi.fn((pathName: string) => {
          return pathName;
        }),
        isPackaged: false,
        on: vi.fn(),
        getName: () => 'NiceNode',
      },
      powerMonitor: {
        isOnBatteryPower: vi.fn(),
      },
      autoUpdater: vi.fn(),
      nativeTheme: {
        on: vi.fn(),
      },
    };
  });
  vi.mock('@sentry/electron/main', () => {
    return {
      init: vi.fn(() => {
        return {};
      }),
    };
  });
  vi.mock('../../main/i18nMain', () => {
    return {
      default: {
        // Mock any other properties or methods if needed
        getFixedT: vi.fn((x, y) => {
          return {
            t: (k: any) => k, // just return the key for simplicity
          };
        }),
      },
      // changeLanguage: vi.fn(),
      // init: vi.fn(),
      // use: vi.fn(() => i18nMock), // for chaining .use() calls
    };
  });
});
const versionRegex = /(\d+\.\d+\.\d+)/;

describe.sequential('Install and Uninstall Podman', () => {
  it('If pre-installed, uninstall to test install next', async () => {
    const versionBefore = await getInstalledPodmanVersion();
    if (versionBefore !== undefined) {
      expect(versionBefore).toMatch(versionRegex);
      const resultInstall = await uninstallOnLinux();
      expect(resultInstall).toEqual(true);
      const versionAfter = await getInstalledPodmanVersion();
      expect(versionAfter).toBeUndefined();
    }
  });

  it('Install is successful and returns true', async () => {
    const versionBefore = await getInstalledPodmanVersion();
    expect(versionBefore).toBeUndefined();
    const resultInstall = await installOnLinux();
    expect(resultInstall).toEqual(true);
    const versionAfter = await getInstalledPodmanVersion();
    expect(versionAfter).toMatch(versionRegex);
    expect(versionAfter > PODMAN_MIN_VERSION).toBeTruthy();
  }, 20000); // 20 seconds timeout

  it('Uninstall is successful and returns true', async () => {
    const versionBefore = await getInstalledPodmanVersion();
    expect(versionBefore).toMatch(versionRegex);
    expect(versionBefore > PODMAN_MIN_VERSION).toBeTruthy();
    // expect(versionBefore).toEqual('4.3.1');
    const resultInstall = await uninstallOnLinux();
    expect(resultInstall).toEqual(true);
    const versionAfter = await getInstalledPodmanVersion();
    expect(versionAfter).toBeUndefined();
  });
  // check not installed before
  // version?
  // it('Is successful and returns true', async () => {
  //   const resultInstall = await installPodman();
  //   expect(resultInstall).toEqual(true);
  // });
});
