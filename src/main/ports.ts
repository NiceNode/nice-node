import { DockerExecution as PodmanExecution } from '../common/nodeSpec';
import { httpGet } from './httpReq';
import { getNodes } from './state/nodes';

export const getPodmanPorts = () => {
  // change to retrieve ports from start command
  const nodes = getNodes();
  let portsArray = [] as string[];

  nodes.forEach((node) => {
    const { execution } = node.spec;
    const { input } = execution as PodmanExecution;
    if (input?.docker) {
      const { ports } = input.docker;
      if (node.config.configValuesMap.httpPort) {
        ports.rest = node.config.configValuesMap.httpPort;
      }

      if (node.config.configValuesMap.webSocketsPort) {
        ports.ws = node.config.configValuesMap.webSocketsPort;
      }

      Object.keys(ports).forEach((key) => {
        if (Array.isArray(ports[key as keyof typeof ports])) {
          portsArray = portsArray.concat(key as keyof typeof ports);
        } else {
          portsArray.push(key as keyof typeof ports);
        }
      });
    }
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
