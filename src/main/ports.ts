import { ConfigValue } from 'common/nodeConfig';
import Node, { NodeConfig } from '../common/node';
import { httpGet } from './httpReq';
import { getNodes } from './state/nodes';
import { addNotification } from './state/notifications';
import { NOTIFICATIONS } from './consts/notifications';

export const getPodmanPortsForNode = (node: Node): ConfigValue[] => {
  const portsArray = [] as ConfigValue[];
  const { configTranslation } = node.spec;

  if (!configTranslation) return portsArray;

  // Extract default port values safely with optional chaining
  const defaultHttpPort = configTranslation.httpPort?.defaultValue;
  const defaultWebSocketsPort = configTranslation.webSocketsPort?.defaultValue;
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

  return portsArray;
};

export const getPodmanPorts = () => {
  const nodes = getNodes();
  const portsArray = [] as ConfigValue[];

  nodes.forEach((node) => {
    portsArray.push(...getPodmanPortsForNode(node));
  });

  return portsArray;
};

export const getClosedPorts = (
  configPorts: ConfigValue[],
  openPorts: ConfigValue[],
): ConfigValue[] => {
  return configPorts.filter((port) => !openPorts.includes(port));
};

export const didPortsChange = (
  objectValuesMap: NodeConfig,
  node: Node,
): boolean => {
  if (!node || !node.spec || !node.spec.configTranslation) return false;

  const baseKeys = ['httpPort', 'enginePort', 'webSocketsPort'];
  const p2pKeys = ['p2pPortsUdp', 'p2pPortsTcp'];

  const hasBaseKeyChanged = baseKeys.some((key) => {
    const objectValue = objectValuesMap.configValuesMap[key];
    const configValue = node.config?.configValuesMap?.[key];
    const defaultValue = node.spec.configTranslation?.[key]?.defaultValue;
    return (
      (configValue && configValue !== objectValue) ||
      (!configValue && defaultValue !== objectValue)
    );
  });

  if (hasBaseKeyChanged) return true;

  const objectP2PPort = objectValuesMap.configValuesMap.p2pPorts;
  const configP2PPort = node.config?.configValuesMap?.p2pPorts;
  const defaultP2PPort = node.spec.configTranslation.p2pPorts?.defaultValue;

  if (objectP2PPort) {
    return (
      (configP2PPort && configP2PPort !== objectP2PPort) ||
      (!configP2PPort && defaultP2PPort !== objectP2PPort)
    );
  }
  return p2pKeys.some((key) => {
    const objectValue = objectValuesMap.configValuesMap[key];
    const configValue = node.config?.configValuesMap?.[key];
    const defaultValue = node.spec.configTranslation?.[key]?.defaultValue;
    return (
      (configValue && configValue !== objectValue) ||
      (!configValue && defaultValue !== objectValue)
    );
  });
};

/**
 * Checks the ports to see if they are open or closed
 * @param ports
 * @returns path of the downloaded file
 */
export const checkPorts = async (
  ports: number[] | ConfigValue[],
): Promise<any> => {
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

export const checkNodePortsAndNotify = (node: Node) => {
  const podmanPorts = getPodmanPortsForNode(node);
  checkPorts(podmanPorts)
    .then((openPorts) => {
      const closedPorts = getClosedPorts(podmanPorts, openPorts);
      if (closedPorts.length > 0) {
        addNotification(
          NOTIFICATIONS.WARNING.PORT_CLOSED,
          closedPorts.join(', '),
        );
      }
      return null;
    })
    .catch((error) => {
      console.log('Error checking ports:', error.message);
    });
};
