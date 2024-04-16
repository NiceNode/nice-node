import type { ForgeConfig, ForgePackagerOptions } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import * as path from 'node:path';
import packageJson from './package.json';

const { version } = packageJson;

const iconDir = path.resolve(__dirname, 'assets', 'icons');
console.log("forge.config.ts iconDir: ", iconDir);

const packagerConfig: ForgePackagerOptions = {
  asar: true,
  icon: path.resolve(iconDir, '..', 'icon'),
  executableName: 'nice-node', // required for linux?
  appBundleId: 'org.jgr.NiceNode',
  protocols: [
    {
      name: 'NiceNode Protocol',
      schemes: ['nice-node'],
    }
  ]
  // unsure if this is needed below:
  // ignore: [ /stories/, /__tests__/, /.storybook/, /storybook/, /storybook-static/ ],
};

// skip signing & notarizing on local builds
console.log("process.env.CI: ", process.env.CI);
if(process.env.CI && process.env.NO_CODE_SIGNING !== 'true') {
  console.log("Setting packagerConfig.osxSign and osxNotarize");
  if(process.env.APPLE_PROD_CERT_NAME) {
    console.log("process.env.APPLE_PROD_CERT_NAME is not null");
  }
  packagerConfig.osxSign = {
    identity: process.env.APPLE_PROD_CERT_NAME,
  };
  packagerConfig.osxNotarize = {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  };
} else if(process.env.LOCAL_MAC_SIGNING === 'true') {
  packagerConfig.osxSign = {}; // local keychain works automatically
}

const config: ForgeConfig = {
  packagerConfig,

  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch: string) => ({
        name: 'nice-node',
        authors: 'NiceNode LLC',
        exe: 'nice-node.exe',
        noMsi: true,
        setupExe: `NiceNode-${version}-windows-${arch}-setup.exe`,
        setupIcon: path.resolve(iconDir, '..', 'icon.ico')
      }),
    },
    new MakerZIP({}),
    new MakerRpm({}, ['linux']),
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        icon: {
          scalable: path.resolve(iconDir, 'icon.svg'),
          // scalable: './assets/icons/icon.svg',
          '1024x1024': path.resolve(iconDir, '1024x1024.png'),
          '512x512': path.resolve(iconDir, '512x512.png'),
          '256x256': path.resolve(iconDir, '256x256.png'),
          '128x128': path.resolve(iconDir, '128x128.png'),
          '96x96': path.resolve(iconDir, '96x96.png'),
          '64x64': path.resolve(iconDir, '64x64.png'),
          '48x48': path.resolve(iconDir, '48x48.png'),
          '32x32': path.resolve(iconDir, '32x32.png'),
          '16x16': path.resolve(iconDir, '16x16.png'),
        },
        executableName: 'nice-node',
        productName: 'NiceNode',
        productDescription: "By running a node you become part of a global movement to decentralize a world of information. Prevent leaking your personal data to third party nodes. Ensure access when you need it, and don't be censored. Decentralization starts with you. Voice your choice, help your peers.",
        maintainer: "NiceNode LLC <johns@nicenode.xyz>",
        categories: ['Utility', 'System', 'Network', 'Development'],
        mimeType: ['application/x-nice-node', 'x-scheme-handler/nice-node'],
    }
    },
    new MakerDMG({
      background: './assets/dmg-background.tiff',
      // installer name. default includes version number in filename
      // name: "NiceNode Installer",
      icon: './assets/installer.icns',
      overwrite: true,
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/main/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'NiceNode',
          // name: 'nice-node',
          name: 'test-nice-node-updater'
        },
        prerelease: true,
        generateReleaseNotes: true
      },
    },
  ]
};

export default config;
