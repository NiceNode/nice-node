import { ConfigTranslationMap, ConfigValue } from 'common/nodeConfig';
import { httpGet } from './httpReq';
import { getNodes } from './state/nodes';

export const getPodmanPorts = () => {
  const nodes = getNodes();
  const portsArray = [] as ConfigValue[];

  nodes.forEach((node) => {
    const { configTranslation } = node.spec;
    if (!configTranslation) return;

    // Extract default port values safely with optional chaining
    const defaultHttpPort = configTranslation.httpPort?.defaultValue;
    const defaultWebSocketsPort =
      configTranslation.webSocketsPort?.defaultValue;
    const defaultP2pPorts = configTranslation.p2pPorts?.defaultValue;
    const defaultP2pPortsUdp = configTranslation.p2pPortsUdp?.defaultValue;
    let defaultP2pPortsTcp = configTranslation.p2pPortsTcp?.defaultValue;
    const defaultEnginePort = configTranslation.enginePort?.defaultValue;

    // Check if UDP and TCP ports are the same, if yes, push only one value
    if (defaultP2pPortsUdp === defaultP2pPortsTcp) {
      defaultP2pPortsTcp = undefined;
    }

    // Filtering out undefined values and spreading them into the portsArray
    portsArray.push(
      ...[
        defaultHttpPort,
        defaultWebSocketsPort,
        defaultP2pPorts,
        defaultP2pPortsUdp,
        defaultP2pPortsTcp,
        defaultEnginePort,
      ].filter(Boolean),
    );
  });

  return portsArray;
};

/**
 * Checks the ports to see if they are open or closed
 * @param ports
 * @returns path of the downloaded file
 */
export const checkPorts = async (ports: number[]): Promise<any> => {
  const baseUrl = 'https://port-checker.vercel.app/api/checker';
  const url = `${baseUrl}?ports=${ports.join(',')}`;

  const response = await httpGet(url);

  return new Promise((resolve, reject) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      if (response.statusCode !== 200) {
        reject(new Error(`Request failed with status: ${response.statusCode}`));
      } else {
        const parsedData = JSON.parse(data);
        resolve(parsedData?.open_ports);
      }
    });
  });
};
