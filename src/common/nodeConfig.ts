// export type SelectControl = { value: 'string'; config: string[] | undefined };
// export type ConfigTranslationControl = {
//   // displayName: string; UI Only
// type: 'filePath' | 'text' | 'select'; UI Only
//   defaultValue: string;
//   translation:
//     | { value: 'string'; config: string[] | undefined }[]
//     | {
//         type: 'text/ipAddress';
//         default: '0.0.0.0';
//         config: ['--JsonRpc.Host'];
//       }
//     | {
//         type: 'filePath';
//         default: string;
//         cliConfigPrefix: string;
//       };
// };
// type ControlTypes = 'filePath' | 'text' | 'select';
type FilePathControl = {
  type: 'filePath';
  displayName: string;
};
type TextControl = {
  type: 'text';
  displayName: string;
};
type SelectControl = {
  type: 'select';
  displayName: string;
  options: any[];
  isSingleSelect?: boolean;
};
// export type ConfigTranslationControl = {
//   // displayName: string; UI Only
//   // type: 'filePath' | 'text' | 'select';
//   default?: string;
//   cliConfigPrefix: string;
// };
export type ConfigTranslationControl =
  | FilePathControl
  | SelectControl
  | TextControl;
// export type ConfigTranslation = {
//   // set http
//   http?: ConfigTranslationControl;
//   dataDir?: ConfigTranslationControl;
// };
export type EthNodeConfigValues = {
  type: 'EthNode';
  dataDir: {
    value?: string;
  };
};
export type EthNodeSpecConfigTranslation = {
  type: 'EthNode';
  translation: {
    dataDir: {
      defaultValue?: string;
      cliConfigPrefix: string;
    };
    http: {
      defaultValue?: string;
      cliConfigPrefix: string;
      onlyPassCliConfigPrefix?: boolean;
    };
    httpCorsDomains: {
      defaultValue?: string;
      cliConfigPrefix: string;
    };
  };
};
export type CustomNodeSpecConfigTranslation = {
  type: 'Custom';
  translation: Record<
    string,
    {
      cliConfigPrefix: string;
      defaultValue?: string;
      onlyPassCliConfigPrefix?: boolean;
      // exampleValue?: string;
      value?: string;
      uiControl: ConfigTranslationControl;
    }
  >;
};

export type UIConfigTranslation = {
  type: 'EthNode' | 'OtherNode';
  translation: Record<string, ConfigTranslationControl>;
  // dataDir: FilePathControl;
};
export const EthNodeUIConfigTranslation: UIConfigTranslation = {
  type: 'EthNode',
  translation: {
    dataDir: {
      displayName: 'Change where node data is stored',
      type: 'filePath',
    },
    http: {
      displayName:
        'Disable/enable node rpc http connections (*NiceNode requires http connections)',
      type: 'select',
      options: ['Enabled', 'Disabled'],
    },
    httpCorsDomains: {
      displayName:
        'Change where the node accepts http connections (use comma separated urls)',
      type: 'text',
    },
  },
};
// export type EthNodeConfigTranslation = EthNodeSpecConfigTranslation &
//   EthNodeUIConfigTranslation &
//   EthNodeConfigValues;

// const test: EthNodeConfigTranslation = {
//   type: 'EthNode',
//   dataDir: {
//     displayName: 'test',
//   }
// };
export type DefaultConfigTranslation = {
  // set http
  http: {
    displayName: 'Enable HTTP-RPC Server';
    defaultValue: 'Enable';
    translation: [
      {
        value: 'Enable';
        config: ['--http']; // geth, ligthouse
      },
      {
        value: 'Disable';
        config: [];
      }
    ];
  };
};
export type ConfigTranslationEx = {
  // set http
  http: {
    displayName: 'Enable HTTP-RPC Server';
    defaultValue: 'Enable';
    translation: [
      {
        value: 'Enable';
        config: ['--JsonRpc.Enabled', 'true']; // nethermind
        // config: ['--http']; // lighthouse
        // config: ['--http']; // geth
      },
      {
        value: 'Disable';
        config: [];
      }
    ];
  };
  httpAddress: {
    displayName: 'HTTP-RPC server listening interface';
    type: 'text/ipAddress';
    default: '0.0.0.0';
    config: ['--JsonRpc.Host']; // nethermind
    // config: ['--http-address']; // lighthouse
    // config: ['--http']; // geth
  };
  network: // | {
  //     values: ['mainnet', 'goerli', 'ropsten'];
  //     default: 'mainnet';
  //     config: ['--network']; //lighthouse
  //   }
  // |
  {
    displayName: 'Ethereum network';
    defaultValue: 'mainnet';
    translation: [
      //geth
      {
        value: 'mainnet';
        config: ['--mainnet'];
      },
      {
        value: 'kiln';
        config: ['--kiln'];
      },
      {
        value: 'goerli';
        config: ['--goerli'];
      }
    ];
  };
  syncMode: {
    displayName: 'Node sync mode';
    defaultValue: 'snap';
    translation: [
      //geth
      {
        value: 'snap';
        config: ['--syncmode', 'snap'];
      },
      {
        value: 'fast';
        config: ['--syncmode', 'fast'];
      },
      {
        value: 'light';
        config: ['--syncmode', 'light'];
      }
    ];
  };
  httpApis: {
    displayName: "API's offered over the HTTP-RPC interface";
    defaultValue: 'eth,web3,net';
    type: 'select/multi';
    join: ',';
    config: ['--http.api'];
    translation: [
      //geth
      {
        value: 'eth';
        config: 'eth';
      },
      {
        value: 'web3';
        config: 'web3';
      },
      {
        value: 'net';
        config: 'net';
      },
      {
        value: 'admin';
        config: 'admin';
      },
      {
        value: 'net';
        config: 'net';
      }
    ];
  };
  // set http port
  // get peers
  //
};

export type NiceNodeSpecConfigTranslation = EthNodeSpecConfigTranslation;
