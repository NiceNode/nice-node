import { Docker, Options } from 'docker-cli-js';
import path from 'node:path';
import sleep from 'await-sleep';
import { httpGet, httpGetJson } from './httpReq';

import logger from './logger';

// const options = {
//   machineName: undefined, // uses local docker
//   currentWorkingDirectory: undefined, // uses current working directory
//   echo: true, // echo command output to stdout/stderr
//   env: undefined,
//   stdin: undefined,
// };

const options = new Options(
  undefined,
  path.join(__dirname),
  true,
  undefined,
  undefined
);

export const initialize = async () => {
  const docker = new Docker(options);
  let data = await docker.command('info');
  // console.log('DOCKER info DATA: ', data);

  // data = await docker.command('pull sigp/lighthouse:latest-modern');
  // console.log('DOCKER docker pull: ', data);

  // run beacon node
  // console.log('DOCKER info DATA: ', data);
  // data = await docker.command(
  //   'run -v $HOME/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse beacon'
  // );
  data = await docker.command(`ps --no-trunc`);
  console.log('DOCKER ps -s data: ', data);
  if (data?.containerList && data.containerList[0]) {
    const containerId = data.containerList[0]['container id'];
    data = await docker.command(`logs -f -n 100 ${containerId}`);
    console.log('DOCKER stop data: ', data);
    // data = await docker.command(`stop ${containerId}`);
    // console.log('DOCKER stop data: ', data);
  }
  // containerList: [
  //   {
  //     'container id': '041558a3fd96',
  //     image: 'sigp/lighthouse',
  //     command: '"lighthouse --networ…"',
  //     created: '55 seconds ago',
  //     status: 'Up 54 seconds',
  //     ports: '127.0.0.1:5052->5052/tcp, 0.0.0.0:9000->9000/tcp, 0.0.0.0:9000->9000/udp, :::9000->9000/tcp, :::9000->9000/udp',
  //     names: 'keen_vaughan',
  //     size: '0B (virtual 196MB)'
  //   }
  // ]

  // data = await docker.command(
  //   'run -d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052 -v $HOME/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse --network mainnet beacon --http --http-address 0.0.0.0'
  // );
  // console.log('DOCKER docker run data: ', data);
  // const { containerId, raw, command } = data;
  // console.log('containerId: ', containerId);
  // console.log('DOCKER docker run data: ', data);
  // wait x time
  try {
    await sleep(20000);

    console.log('fetching beacon node data...');
    const parsedData = await httpGetJson(
      'http://localhost:5052/eth/v1/config/spec',
      true
    );
    console.log('beacon node data parsedData: ', parsedData);
    data = await docker.command(`ps -s`);
    console.log('DOCKER ps -s data: ', data);

    // data = await docker.command(`stop ${containerId}`);
    // console.log('DOCKER stop data: ', data);
  } catch (err) {
    // data = await docker.command(`stop ${containerId}`);
    // console.log('DOCKER stop data: ', data);
  }

  // get logs/rpc stats

  // kill
};
