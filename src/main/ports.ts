import type Node from '../common/node';
import type { NodeConfig } from '../common/node';
import type { ConfigValue } from '../common/nodeConfig';
import { NOTIFICATIONS } from './consts/notifications';
import { httpGet } from './httpReq';
import { getNodePackageByServiceNodeId } from './state/nodePackages';
import { getNode, getNodes, getSetPortHasChanged } from './state/nodes';
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

  nodes.forEach((node: any) => {
    const { p2pPorts: nodeP2pPorts, otherPorts: nodeOtherPorts } =
      getPodmanPortsForNode(node);
    p2pPorts = [...p2pPorts, ...nodeP2pPorts];
    otherPorts = [...otherPorts, ...nodeOtherPorts];
  });

  return { p2pPorts, otherPorts };
};

// Function to dynamically find the next available port
const findNextAvailablePort = (
  usedPorts: string[],
  startingPort: number,
): string => {
  let port = startingPort;
  while (usedPorts.includes(port.toString())) {
    port++;
  }
  return port.toString();
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

export const assignPortsToNode = (node: Node): Node => {
  // Retrieve all used ports and convert them to strings
  const { p2pPorts: usedP2pPorts, otherPorts: usedOtherPorts } =
    getPodmanPorts();
  const usedPorts = [...usedP2pPorts, ...usedOtherPorts].map(
    (port) => port?.toString() ?? '',
  );

  // Define the port types to update
  const portTypes = [
    'httpPort',
    'p2pPorts',
    'enginePort',
    'p2pPortsUdp',
    'p2pPortsTcp',
    'webSocketsPort',
    'quicPortUdp',
  ]; // Add other relevant port types

  const executionService = getNodePackageByServiceNodeId(
    node.id,
  )?.services.find((service) => {
    return service.serviceId === 'executionClient';
  });
  // Update ports using array methods
  portTypes.forEach((portType) => {
    const defaultPort =
      node.spec.configTranslation?.[portType]?.defaultValue ?? null;
    const currentPort = node.config.configValuesMap[portType];

    if (!defaultPort && !currentPort) {
      return;
    }

    // Use current port, or default if not initialized, converted to a number
    let assignedPort = Number.parseInt(
      (currentPort || defaultPort) as string,
      10,
    );

    // Find next available port if the current/default one is in use
    if (usedPorts.includes(assignedPort.toString())) {
      assignedPort = Number.parseInt(
        findNextAvailablePort(usedPorts, assignedPort),
        10,
      );
    }

    // Add the newly assigned port to the used ports list
    usedPorts.push(assignedPort.toString());
    // Update the node configuration with the port as a string
    node.config.configValuesMap[portType] = assignedPort.toString();
  });

  if (node.spec.rpcTranslation === 'eth-l1-beacon' && executionService) {
    const executionNode = getNode(executionService.node.id);
    console.log('nodeStatus', executionNode.status);
    console.log('nodeInitialized', executionNode.initialized);
    let executionEndpoint = node.config.configValuesMap.executionEndpoint;
    console.log(
      'enginePortTest',
      executionNode.config.configValuesMap.enginePort,
    );

    // Check if the endpoint is enclosed in quotes
    const isQuoted =
      executionEndpoint.startsWith('"') && executionEndpoint.endsWith('"');
    const portSuffix = `:${executionNode.config.configValuesMap.enginePort}`;

    // Append the port inside the quotes if necessary
    if (isQuoted) {
      executionEndpoint = `${executionEndpoint.slice(0, -1) + portSuffix}"`;
    } else {
      executionEndpoint += portSuffix;
    }
    node.config.configValuesMap.executionEndpoint = executionEndpoint;
  }

  return node; // Return the updated node without persisting changes
};

export const didPortsChange = (
  objectValuesMap: NodeConfig,
  node: Node,
): boolean => {
  if (!node || !node.spec || !node.spec.configTranslation) return false;

  const baseKeys = ['httpPort', 'enginePort', 'webSocketsPort', 'quicPortUdp'];
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

    response.on('data', (chunk: string) => {
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
