import { parsePodmanLogMetadata } from '../../main/util/nodeLogUtils';

jest.setTimeout(10000);
describe('Parsing log string testing', () => {
  it('Successfully parses docker log strings with valid timestamps', async () => {
    const logBesu1 =
      '2023-09-19T22:06:50-00:00 2023-09-19 22:06:50.398+00:00 | main | INFO  | Besu | Starting Besu version: besu/v21.10.3/linux-x86_64/adoptopenjdk-java-11';
    const logTekuInfo1 =
      '2023-09-19T20:36:55-00:00 20:36:55.300 INFO  - Teku Event: :teku:sync EventTracker: Starting tracking of sync event';
    const logTekuWarn1 =
      '2023-09-19T20:36:55-00:00 20:36:55.300 WARN  - Teku Event: :teku:sync_warn: Warning during synchronization';
    const logTekuError1 =
      '2023-09-19T20:36:55-00:00 20:36:55.300 ERROR  - Teku Event: :teku:sync_error: Error during synchronization';
    // const logNimbusInfo1 =
    //   'INF 2023-09-19 19:57:26.551+00:00 Threadpool started                         topics="beacnde" numThreads=8 nimbus-beacon';
    // const logNimbusWarn1 =
    //   '2023-09-19T20:36:55-00:00 20:36:55.300 WRN  - Nimbus Event: Eth2Status_Warn: Warning in beacon node';
    // const logNimbusError1 =
    //   '2023-09-19T20:36:55-00:00 20:36:55.300 ERR  - Nimbus Event: Eth2Status_Error: Error in beacon node';
    const logPrysmError1 =
      '2022-11-12T20:36:55-00:00 time="2022-12-15 20:48:46" level=error msg="Could not connect to execution endpoint" error="403 Forbidden: invalid host specified';
    const logNethermindMultiLine1 =
      '2023-03-19T22:50:43-07:00 2023-03-20 05:50:43.8033|***** JSON RPC report *****';
    const logNethermindMultiLine2 =
      'Nethermind loves mutli-line logs. I am the 2nd line without a podman timestamp leading';

    // difference here is that podman's datetime string is different on Ubuntu
    const logHubbleUbuntu =
      '2023-10-12T08:41:58.962229000-07:00 {"level":30,"time":1697125318962,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359080423264256,"fid":21101,"type":"LINK_ADD","hash":"0xf1693d08d2a763f3068aa076ed6a62b142e97129","source":"gossip","msg":"submitMessage success"}';

    const metadataBesu1 = parsePodmanLogMetadata(logBesu1, 'besu');
    const metadataTekuInfo1 = parsePodmanLogMetadata(
      logTekuInfo1,
      'teku-beacon',
    );
    const metadataTekuWarn1 = parsePodmanLogMetadata(
      logTekuWarn1,
      'teku-beacon',
    );
    const metadataTekuError1 = parsePodmanLogMetadata(
      logTekuError1,
      'teku-beacon',
    );

    // const metadataNimbusInfo1 = parsePodmanLogMetadata(
    //   logNimbusInfo1,
    //   'nimbus-beacon',
    // );
    // const metadataNimbusWarn1 = parsePodmanLogMetadata(
    //   logNimbusWarn1,
    //   'nimbus-beacon',
    // );
    // const metadataNimbusError1 = parsePodmanLogMetadata(
    //   logNimbusError1,
    //   'nimbus-beacon',
    // );
    const metadataPrysmError1 = parsePodmanLogMetadata(
      logPrysmError1,
      'prysm-beacon',
    );

    const metadataNethermindMultiLine1 = parsePodmanLogMetadata(
      logNethermindMultiLine1,
      'nethermind',
    );
    const metadataNethermindMultiLine2 = parsePodmanLogMetadata(
      logNethermindMultiLine2,
      'nethermind',
    );

    const metadataRethUbuntu = parsePodmanLogMetadata(logHubbleUbuntu, 'reth');

    expect(metadataBesu1).toEqual({
      message:
        'Besu | Starting Besu version: besu/v21.10.3/linux-x86_64/adoptopenjdk-java-11',
      level: 'INFO',
      timestamp: 1695161210000,
    });
    expect(metadataTekuInfo1).toEqual({
      message:
        'Teku Event: :teku:sync EventTracker: Starting tracking of sync event',
      level: 'INFO',
      timestamp: 1695155815000,
    });
    expect(metadataTekuWarn1).toEqual({
      message: 'Teku Event: :teku:sync_warn: Warning during synchronization',
      level: 'WARN',
      timestamp: 1695155815000,
    });
    expect(metadataTekuError1).toEqual({
      message: 'Teku Event: :teku:sync_error: Error during synchronization',
      level: 'ERROR',
      timestamp: 1695155815000,
    });
    // expect(metadataNimbusInfo1).toEqual({
    //   message: 'Threadpool started topics="beacnde" numThreads=8',
    //   level: 'INFO',
    //   timestamp: 1668285415000,
    // });
    // expect(metadataNimbusWarn1).toEqual({
    //   message: 'Nimbus Event: Eth2Status_Warn: Warning in beacon node',
    //   level: 'WARN',
    //   timestamp: 1668285415000,
    // });
    // expect(metadataNimbusError1).toEqual({
    //   message: 'Nimbus Event: Eth2Status_Error: Error in beacon node',
    //   level: 'ERROR',
    //   timestamp: 1668285415000,
    // });
    expect(metadataPrysmError1).toEqual({
      message:
        'time="2022-12-15 20:48:46" level=error msg="Could not connect to execution endpoint" error="403 Forbidden: invalid host specified',
      level: 'ERROR',
      timestamp: 1668285415000,
    });

    /**
     * Order matters here for a multi-line log
     */
    expect(metadataNethermindMultiLine1).toEqual({
      message: '2023-03-20 05:50:43.8033|***** JSON RPC report *****',
      level: 'INFO',
      timestamp: 1679291443000,
    });
    expect(metadataNethermindMultiLine2).toEqual({
      message:
        'Nethermind loves mutli-line logs. I am the 2nd line without a podman timestamp leading',
      level: 'INFO',
      timestamp: 1679291443000,
    });
    expect(metadataRethUbuntu).toEqual({
      message:
        '{"level":30,"time":1697125318962,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359080423264256,"fid":21101,"type":"LINK_ADD","hash":"0xf1693d08d2a763f3068aa076ed6a62b142e97129","source":"gossip","msg":"submitMessage success"}',
      level: 'INFO',
      timestamp: 1697125318962,
    });
  });
});
