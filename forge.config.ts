import type { ForgeConfig, ForgePackagerOptions } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const packagerConfig: ForgePackagerOptions = {
  asar: true,
  icon: './assets/icon',
  // unsure if this is needed below:
  ignore: [ /stories/, /__tests__/, /.storybook/, /storybook/, /storybook-static/ ],
};

// skip signing & notarizing on local builds
if(process.env.CI) {
  packagerConfig.osxSign = {};
  packagerConfig.osxNotarize = {
    // tool: 'notarytool', the default
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  };
}

const config: ForgeConfig = {
  packagerConfig,

  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      authors: 'NiceNode LLC'
    }),
    new MakerZIP({}),
    new MakerRpm({}),
    new MakerDeb({}),
    new MakerDMG({
      background: './assets/background.tiff',
      // installer name. default includes version number in filename
      // name: "NiceNode Installer",
      icon: './assets/installer.icns',
      additionalDMGOptions: {
      }
    }, ['darwin']),
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
          name: 'nice-node',
        },
        prerelease: true
      },
    },
  ]
};

export default config;
