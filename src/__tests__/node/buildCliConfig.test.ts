import { describe, expect, it } from 'vitest';
import { buildCliConfig, buildEnvInput } from '../../common/nodeConfig.js';

describe('Building cli config and env variable cli input', () => {
  it('Successfully creates a single env variable cli input', async () => {
    const configValuesMap = { plexClaimCode: 'claim123' };
    const configTranslationMap = {
      plexClaimCode: {
        displayName: 'Plex claim code',
        cliConfigPrefix: 'PLEX_CLAIM=',
        uiControl: {
          type: 'text',
        },
        isEnvVariable: true,
        addNodeFlow: 'required',
        infoDescription:
          'Sign in at https://www.plex.tv/claim/, get a code, and paste it here',
        defaultValue: '',
        documentation: 'https://www.plex.tv/claim/',
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
      isBuildingEnvInput: true,
    });

    expect(cliConfig1).toEqual('-e PLEX_CLAIM=claim123');
  });

  it('Successfully creates multiple env variable cli input', async () => {
    const configValuesMap = { plexClaimCode: 'claim123', httpPortEnv: '8080' };
    const configTranslationMap = {
      plexClaimCode: {
        displayName: 'Plex claim code',
        cliConfigPrefix: 'PLEX_CLAIM=',
        uiControl: {
          type: 'text',
        },
        isEnvVariable: true,
        addNodeFlow: 'required',
        infoDescription:
          'Sign in at https://www.plex.tv/claim/, get a code, and paste it here',
        defaultValue: '',
        documentation: 'https://www.plex.tv/claim/',
      },
      httpPortEnv: {
        displayName: 'HTTP PORT',
        cliConfigPrefix: 'HTTP_PORT=',
        uiControl: {
          type: 'text',
        },
        isEnvVariable: true,
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
      isBuildingEnvInput: true,
    });

    expect(cliConfig1).toEqual('-e PLEX_CLAIM=claim123 -e HTTP_PORT=8080');
  });

  it('Successfully creates a single cli config input', async () => {
    const configValuesMap = { httpPort: '8080' };
    const configTranslationMap = {
      httpPort: {
        displayName: 'HTTP PORT',
        cliConfigPrefix: '--http-port=',
        uiControl: {
          type: 'text',
        },
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
    });

    expect(cliConfig1).toEqual('--http-port=8080');
  });

  it('Successfully creates multiple cli config input', async () => {
    const configValuesMap = {
      httpPort: '8080',
      network: 'Mainnet',
      plexClaimCode: 'claimIgnoreMe',
    };
    const configTranslationMap = {
      httpPort: {
        displayName: 'HTTP PORT',
        cliConfigPrefix: '--http-port=',
        uiControl: {
          type: 'text',
        },
      },
      network: {
        displayName: 'Network',
        defaultValue: 'Mainnet',
        hideFromUserAfterStart: true,
        uiControl: {
          type: 'select/single',
          controlTranslations: [
            {
              value: 'Mainnet',
              config: '--mainnet',
            },
            {
              value: 'Holesky',
              config: '--holesky',
            },
            {
              value: 'Sepolia',
              config: '--sepolia',
            },
          ],
        },
      },
      plexClaimCode: {
        displayName: 'Plex claim code',
        cliConfigPrefix: 'PLEX_CLAIM=',
        uiControl: {
          type: 'text',
        },
        isEnvVariable: true,
        addNodeFlow: 'required',
        infoDescription:
          'Sign in at https://www.plex.tv/claim/, get a code, and paste it here',
        defaultValue: '',
        documentation: 'https://www.plex.tv/claim/',
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
    });

    expect(cliConfig1).toEqual('--http-port=8080 --mainnet');
  });

  it('Successfully ignores a single cli config input when building env input', async () => {
    const configValuesMap = { httpPort: '8080' };
    const configTranslationMap = {
      httpPort: {
        displayName: 'HTTP PORT',
        cliConfigPrefix: '--http-port=',
        uiControl: {
          type: 'text',
        },
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
      isBuildingEnvInput: true,
    });

    expect(cliConfig1).toEqual('');
  });

  it('Successfully ignores a single cli config input and adds 1 env var when building env input', async () => {
    const configValuesMap = { httpPort: '8080', myFavEnvVar: 'muchwow' };
    const configTranslationMap = {
      httpPort: {
        displayName: 'HTTP PORT',
        cliConfigPrefix: '--http-port=',
        uiControl: {
          type: 'text',
        },
      },
      myFavEnvVar: {
        displayName: 'Plex claim code',
        cliConfigPrefix: 'MYFAVENVVAR=',
        uiControl: {
          type: 'text',
        },
        isEnvVariable: true,
      },
    };
    const cliConfig1 = buildCliConfig({
      configValuesMap,
      configTranslationMap,
      excludeConfigKeys: [],
      isBuildingEnvInput: true,
    });

    expect(cliConfig1).toEqual('-e MYFAVENVVAR=muchwow');
  });

  it('[buildEnvInput] Successfully builds env input for 2 user supplied env vars', async () => {
    const configValuesMap = {
      envInput: 'ETHPORTPORT=123456789,BASEPORT=987',
      myFavEnvVar: 'muchwow',
    };
    const cliConfig1 = buildEnvInput(configValuesMap.envInput);

    expect(cliConfig1).toEqual('-e ETHPORTPORT=123456789 -e BASEPORT=987');
  });
});
