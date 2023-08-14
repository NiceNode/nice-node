import { execSync } from 'child_process';
import { httpGet } from './httpReq';

export const getPodmanPorts = () => {
  const output = execSync("podman ps -a --format '{{.Ports}}'", {
    encoding: 'utf8',
  });

  // Split the output by lines and map through them to extract ports
  return output
    .split('\n')
    .map((line) =>
      (line.match(/\d+\.\d+\.\d+\.\d+:(\d+-?\d+)?->\d+/g) || []).flatMap(
        (match) => {
          const portSegment = match.split('->')[0].split(':')[1];
          if (portSegment.includes('-')) {
            const [start, end] = portSegment.split('-').map(Number);
            return Array.from({ length: end - start + 1 }, (_, i) => i + start);
          }
          return [Number(portSegment)];
        },
      ),
    )
    .reduce((acc, currPorts) => acc.concat(currPorts), [])
    .filter((port, index, self) => self.indexOf(port) === index); // Filter to get unique ports
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
