import type Node from '../common/node';
import type { NodeConfig } from '../common/node';
import type { ConfigValue } from '../common/nodeConfig';
import { NOTIFICATIONS } from './consts/notifications';
import { httpGet } from './httpReq';
import { getNodes, getSetPortHasChanged } from './state/nodes';
import { addNotification } from './state/notifications';

export const getPodmanPortsForNode = (
  node: Node,
): { p2pPorts: ConfigValue[]; otherPorts: ConfigValue[] } => {
  const { configTranslation } = node.spec;
  const { configValuesMap } = node.config;
  if (!configTranslation) return { p2pPorts: [], otherPorts: [] };

  // Extract default port values safely with optional chaining
  const defaultHttpPort =
    configValuesMap.httpPort || configTranslation.httpPort?.defaultValue;
  const defaultWebSocketsPort =
    configValuesMap.webSocketsPort ||
    configTranslation.webSocketsPort?.defaultValue;
  const defaultP2pPorts =
    configValuesMap.p2pPorts || configTranslation.p2pPorts?.defaultValue;
  const defaultP2pPortsUdp =
    configValuesMap.p2pPortsUdp || configTranslation.p2pPortsUdp?.defaultValue;
  let defaultP2pPortsTcp =
    configValuesMap.p2pPortsTcp || configTranslation.p2pPortsTcp?.defaultValue;
  const defaultEnginePort =
    configValuesMap.enginePort || configTranslation.enginePort?.defaultValue;
  const defaultGRpcPort =
    configValuesMap.gRpcPort || configTranslation.gRpcPort?.defaultValue;

  // Check if UDP and TCP ports are the same, if yes, push only one value
  if (defaultP2pPortsUdp === defaultP2pPortsTcp) {
    defaultP2pPortsTcp = undefined;
  }

  return {
    p2pPorts: [
      defaultP2pPorts,
      defaultP2pPortsUdp,
      defaultP2pPortsTcp,
      defaultGRpcPort,
    ].filter(Boolean),
    otherPorts: [
      defaultHttpPort,
      defaultWebSocketsPort,
      defaultEnginePort,
    ].filter(Boolean),
  };
};

export const getPodmanPorts = (): {
  p2pPorts: ConfigValue[];
  otherPorts: ConfigValue[];
} => {
  const nodes = getNodes();
  let p2pPorts = [] as ConfigValue[];
  let otherPorts = [] as ConfigValue[];

  nodes.forEach((node) => {
    const { p2pPorts: nodeP2pPorts, otherPorts: nodeOtherPorts } =
      getPodmanPortsForNode(node);
    p2pPorts = [...p2pPorts, ...nodeP2pPorts];
    otherPorts = [...otherPorts, ...nodeOtherPorts];
  });

  return { p2pPorts, otherPorts };
};

export const getClosedPorts = (
  configPorts: ConfigValue[],
  openPorts: ConfigValue[],
): ConfigValue[] => {
  return configPorts.filter((port) => !openPorts.includes(port));
};

export const getUnexpectedOpenPorts = (
  configPorts: ConfigValue[],
  openPorts: ConfigValue[],
): ConfigValue[] => {
  // Find ports that are open but shouldn't be.
  return configPorts.filter((port) => openPorts.includes(port));
};

export const didPortsChange = (
  objectValuesMap: NodeConfig,
  node: Node,
): boolean => {
  if (!node || !node.spec || !node.spec.configTranslation) return false;

  const baseKeys = ['httpPort', 'enginePort', 'webSocketsPort'];
  const p2pKeys = ['p2pPortsUdp', 'p2pPortsTcp', 'gRpcPort'];

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

export const checkNodePortsAndNotify = (node?: Node) => {
  const { p2pPorts, otherPorts } = node
    ? getPodmanPortsForNode(node)
    : getPodmanPorts();
  const allPorts = [...p2pPorts, ...otherPorts];

  checkPorts(allPorts)
    .then((openPorts) => {
      // Check if p2p ports are closed
      const closedP2pPorts = getClosedPorts(p2pPorts, openPorts);
      if (closedP2pPorts.length > 0) {
        addNotification(
          NOTIFICATIONS.WARNING.P2P_PORTS_CLOSED,
          closedP2pPorts.join(', '),
        );
      }

      // Check if other ports are unexpectedly open
      const unexpectedOpenOtherPorts = getUnexpectedOpenPorts(
        otherPorts,
        openPorts,
      );
      if (unexpectedOpenOtherPorts.length > 0) {
        addNotification(
          NOTIFICATIONS.WARNING.UNEXPECTED_PORTS_OPEN,
          unexpectedOpenOtherPorts.join(', '),
        );
      }

      if (node) {
        getSetPortHasChanged(node, false);
      }
      return null;
    })
    .catch((error) => {
      console.log('Error checking ports:', error.message);
    });
};
