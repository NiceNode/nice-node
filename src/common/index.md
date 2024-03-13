# Node Spec Examples

[Typescript type definitions](modules.md)

All available [Node Specs on Github](https://github.com/NiceNode/nice-node/tree/main/src/common/NodeSpecs)

## Node Package Spec example

The top level specificiation

```json
{
  "specId": "ethereum",
  "version": "1.0.0",
  "displayName": "Ethereum",
  "displayTagline": "Non-Validating Node - Ethereum",
  "execution": {
    "executionTypes": ["nodePackage"],
    "defaultExecutionType": "nodePackage",
    "services": [
      {
        "serviceId": "executionClient",
        "name": "Execution Client",
        "nodeOptions": ["nethermind", "besu", "geth", "reth"],
        "required": true,
        "requiresCommonJwtSecret": true
      },
      {
        "serviceId": "consensusClient",
        "name": "Consensus Client",
        "nodeOptions": [
          "lodestar-beacon",
          "teku-beacon",
          "prysm-beacon",
          "lighthouse-beacon",
          "nimbus-beacon"
        ],
        "required": true,
        "requiresCommonJwtSecret": true
      }
    ]
  },
  "category": "L1",
  "rpcTranslation": "eth-l1",
  "systemRequirements": {
    "documentationUrl": "https://geth.ethereum.org/docs/interface/hardware",
    "cpu": {
      "cores": 4
    },
    "memory": {
      "minSizeGBs": 16
    },
    "storage": {
      "minSizeGBs": 1600,
      "ssdRequired": true
    },
    "internet": {
      "minDownloadSpeedMbps": 25,
      "minUploadSpeedMbps": 10
    },
    "docker": {
      "required": true
    }
  },
  "configTranslation": {
    "dataDir": {
      "displayName": "Data location",
      "cliConfigPrefix": "--datadir ",
      "defaultValue": "~/.ethereum",
      "uiControl": {
        "type": "filePath",
        "serviceConfigs": {
          "services": [
            {
              "serviceId": "executionClient",
              "configKey": "dataDir"
            },
            {
              "serviceId": "consensusClient",
              "configKey": "dataDir"
            }
          ]
        }
      },
      "infoDescription": "Data directory for the databases and keystore (default: \"~/.ethereum\")"
    },
    "network": {
      "displayName": "Network",
      "addNodeFlow": "required",
      "defaultValue": "Mainnet",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Mainnet",
            "config": "unused in nodespec",
            "serviceConfigs": {
              "services": [
                {
                  "serviceId": "executionClient",
                  "configValues": {
                    "network": "Mainnet"
                  }
                },
                {
                  "serviceId": "consensusClient",
                  "configValues": {
                    "network": "Mainnet"
                  }
                }
              ]
            }
          },
          {
            "value": "Sepolia",
            "config": "unused in nodespec",
            "serviceConfigs": {
              "services": [
                {
                  "serviceId": "executionClient",
                  "configValues": {
                    "network": "Sepolia"
                  }
                },
                {
                  "serviceId": "consensusClient",
                  "configValues": {
                    "network": "Sepolia"
                  }
                }
              ]
            }
          },
          {
            "value": "Holesky",
            "config": "unused in nodespec",
            "serviceConfigs": {
              "services": [
                {
                  "serviceId": "executionClient",
                  "configValues": {
                    "network": "Holesky"
                  }
                },
                {
                  "serviceId": "consensusClient",
                  "configValues": {
                    "network": "Holesky"
                  }
                }
              ]
            }
          }
        ]
      },
      "documentation": "https://ethereum.org/en/developers/docs/networks/#public-networks"
    }
  },
  "iconUrl": "https://ethereum.png",
  "addNodeDescription": "Running a full etherum node is a two part story. Choosing minority clients are important for the health of the network.",
  "description": "An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum's state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.",
  "resources": [
    {
      "label": "Run your own node",
      "value": "ethereum.org",
      "link": "https://ethereum.org"
    },
    {
      "label": "Learn about client diversity",
      "value": "ethereum.org",
      "link": "https://ethereum.org/en/developers/docs/nodes-and-clients/client-diversity/"
    }
  ]
}
```

## Node (Service) Spec example

The bottom level specificiation

::: info
Ignore references to binary (not currently supported)
:::

```json
{
  "specId": "geth",
  "version": "1.0.0",
  "displayName": "Geth",
  "execution": {
    "executionTypes": ["binary", "docker"],
    "defaultExecutionType": "docker",
    "execPath": "geth",
    "input": {
      "defaultConfig": {
        "http": "Enabled",
        "httpCorsDomains": "http://localhost",
        "webSockets": "Disabled",
        "httpVirtualHosts": "localhost,host.containers.internal",
        "authVirtualHosts": "localhost,host.containers.internal",
        "httpAddress": "0.0.0.0",
        "webSocketAddress": "0.0.0.0",
        "syncMode": "snap"
      },
      "docker": {
        "containerVolumePath": "/root/.ethereum",
        "raw": "",
        "forcedRawNodeInput": "--authrpc.addr 0.0.0.0 --authrpc.jwtsecret /root/.ethereum/jwtsecret --ipcdisable"
      }
    },
    "imageName": "ethereum/client-go:stable",
    "binaryDownload": {
      "type": "static",
      "darwin": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.23-d901d853.tar.gz"
      },
      "linux": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.23-d901d853.tar.gz",
        "amd32": "https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.23-d901d853.tar.gz",
        "arm64": "https://gethstore.blob.core.windows.net/builds/geth-linux-arm64-1.10.23-d901d853.tar.gz",
        "arm7": "https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.10.23-d901d853.tar.gz"
      },
      "windows": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.23-d901d853.zip",
        "amd32": "https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.23-d901d853.zip"
      }
    }
  },
  "category": "L1/ExecutionClient",
  "rpcTranslation": "eth-l1",
  "systemRequirements": {
    "documentationUrl": "https://geth.ethereum.org/docs/interface/hardware",
    "cpu": {
      "cores": 4
    },
    "memory": {
      "minSizeGBs": 16
    },
    "storage": {
      "minSizeGBs": 1600,
      "ssdRequired": true
    },
    "internet": {
      "minDownloadSpeedMbps": 25,
      "minUploadSpeedMbps": 10
    },
    "docker": {
      "required": true
    }
  },
  "configTranslation": {
    "dataDir": {
      "displayName": "Data location",
      "cliConfigPrefix": "--datadir ",
      "defaultValue": "~/.ethereum",
      "uiControl": {
        "type": "filePath"
      },
      "infoDescription": "Data directory for the databases and keystore (default: \"~/.ethereum\")"
    },
    "network": {
      "displayName": "Network",
      "defaultValue": "Mainnet",
      "hideFromUserAfterStart": true,
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Mainnet",
            "config": "--mainnet"
          },
          {
            "value": "Holesky",
            "config": "--holesky"
          },
          {
            "value": "Sepolia",
            "config": "--sepolia"
          }
        ]
      }
    },
    "http": {
      "displayName": "RPC HTTP connections",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Enabled",
            "config": "--http"
          },
          {
            "value": "Disabled"
          }
        ]
      },
      "defaultValue": "Disabled",
      "infoDescription": "NiceNode requires http connections",
      "documentation": "https://geth.ethereum.org/docs/rpc/server"
    },
    "webSockets": {
      "displayName": "WebSocket JSON-RPC connections",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Enabled",
            "config": "--ws"
          },
          {
            "value": "Disabled"
          }
        ]
      },
      "defaultValue": "Disabled",
      "infoDescription": "Enables or disables the WebSocket JSON-RPC service. Beacon nodes may require websockets. The default is false.",
      "documentation": "https://geth.ethereum.org/docs/rpc/server#websocket-server"
    },
    "webSocketsPort": {
      "displayName": "WebSockets JSON-RPC port",
      "cliConfigPrefix": "--ws.port ",
      "defaultValue": "8546",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately.",
      "documentation": "https://geth.ethereum.org/docs/rpc/server#websocket-server"
    },
    "webSocketAddress": {
      "displayName": "WebSocket-RPC server listening interface",
      "cliConfigPrefix": "--ws.addr ",
      "defaultValue": "0.0.0.0",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/interacting-with-geth/rpc#websockets-server"
    },
    "webSocketAllowedOrigins": {
      "displayName": "WebSocket-RPC allowed origins",
      "defaultValue": "http://localhost",
      "cliConfigPrefix": "--ws.origins ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Change where the node accepts web socket connections (use comma separated urls) or \"*\" for all"
    },
    "webSocketApis": {
      "displayName": "Enabled WebSocket APIs",
      "cliConfigPrefix": "--ws.api ",
      "defaultValue": ["eth", "net", "web3"],
      "valuesJoinStr": ",",
      "uiControl": {
        "type": "select/multiple",
        "controlTranslations": [
          {
            "value": "eth",
            "config": "eth"
          },
          {
            "value": "net",
            "config": "net"
          },
          {
            "value": "web3",
            "config": "web3"
          },
          {
            "value": "debug",
            "config": "debug"
          },

          {
            "value": "personal",
            "config": "personal"
          },
          {
            "value": "admin",
            "config": "admin"
          }
        ]
      }
    },
    "httpApis": {
      "displayName": "Enabled HTTP APIs",
      "cliConfigPrefix": "--http.api ",
      "defaultValue": ["eth", "net", "web3"],
      "valuesJoinStr": ",",
      "uiControl": {
        "type": "select/multiple",
        "controlTranslations": [
          {
            "value": "eth",
            "config": "eth"
          },
          {
            "value": "net",
            "config": "net"
          },
          {
            "value": "web3",
            "config": "web3"
          },
          {
            "value": "debug",
            "config": "debug"
          },

          {
            "value": "personal",
            "config": "personal"
          },
          {
            "value": "admin",
            "config": "admin"
          }
        ]
      }
    },
    "httpCorsDomains": {
      "displayName": "HTTP-RPC CORS domains",
      "cliConfigPrefix": "--http.corsdomain ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Change where the node accepts http connections (use comma separated urls)"
    },
    "syncMode": {
      "displayName": "Execution Client Sync Mode",
      "category": "Syncronization",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "snap",
            "config": "--syncmode snap",
            "info": ""
          },
          {
            "value": "full",
            "config": "--syncmode full",
            "info": "~800GB / ~2d"
          },
          {
            "value": "archive",
            "config": "--syncmode full --gcmode archive",
            "info": "~16TB"
          }
        ]
      },
      "addNodeFlow": "required",
      "defaultValue": "snap",
      "documentation": "https://geth.ethereum.org/docs/faq#how-does-ethereum-syncing-work"
    },
    "p2pPorts": {
      "displayName": "P2P port (UDP and TCP)",
      "cliConfigPrefix": "--discovery.port ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Example value: 30303",
      "defaultValue": "30303"
    },
    "enginePort": {
      "displayName": "Engine JSON-RPC listening port",
      "cliConfigPrefix": "--authrpc.port ",
      "defaultValue": "8551",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "The listening port for the Engine API calls for JSON-RPC over HTTP and WebSocket."
    },
    "httpVirtualHosts": {
      "displayName": "Virtual hostnames list",
      "cliConfigPrefix": "--http.vhosts ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard. Default value (localhost)",
      "defaultValue": "localhost,host.containers.internal"
    },
    "httpAddress": {
      "displayName": "HTTP-RPC server listening interface",
      "cliConfigPrefix": "--http.addr ",
      "defaultValue": "0.0.0.0",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/rpc/server#http-server"
    },
    "httpPort": {
      "displayName": "HTTP-RPC server listening port",
      "cliConfigPrefix": "--http.port ",
      "defaultValue": "8545",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/rpc/server#http-server"
    },
    "maxPeerCount": {
      "displayName": "Max Peer Count",
      "cliConfigPrefix": "--maxpeers ",
      "defaultValue": "50",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Set to lower number to use less bandwidth",
      "documentation": "https://geth.ethereum.org/docs/interface/peer-to-peer#peer-limit"
    },
    "authVirtualHosts": {
      "displayName": "Engine RPC virtual hostnames list",
      "cliConfigPrefix": "--authrpc.vhosts ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Comma separated list of virtual hostnames from which to accept authentication requests for engine api's (server enforced). Accepts '*' wildcard. Default value (localhost)",
      "defaultValue": "localhost,host.containers.internal"
    }
  },
  "iconUrl": "https://clientdiversity.org/assets/img/execution-clients/geth-logo.png"
}
```
