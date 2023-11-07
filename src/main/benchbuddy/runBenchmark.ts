import logger from '../logger';
import { runCommand } from '../podman/podman';
import { addBenchmark } from '../state/benchmark';

export const runBenchmark = async () => {
  // run (attached) with json output
  const output = await runCommand(
    'run ghcr.io/nicenode/speedometer -r eth-node -f json',
  );
  logger.info(`Ethereum node benchmark results: ${JSON.stringify(output)}`);

  // on output, store results and send message to front-end
  addBenchmark({
    type: 'ethereum-node',
    timestamp: Date.now(),
    results: output,
  });
};

/**
 Example output:
   * {
      "cpu":{
        "cores":8
      },
      "memory":{
        "total":16,
        "available":15
      },
      "storage":{
        "iops":{
          "read":{
            "average":27394
          },
          "write":{
            "average":9155
          }
        },
        "size":{
          "total":1610,
          "available":1594
        }
      },
      "internet":{
        "download":277,
        "upload":18,
        "latency":38.261,
        "resultsUrl":"https://www.speedtest.net/result/c/0b342659-346a-424c-a287-217b9e798340"
      },
      "time":{
        "localTime":1699323649,
        "serverTime":1699323649
      }
    }
  */
