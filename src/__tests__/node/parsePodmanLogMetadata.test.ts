import { parsePodmanLogMetadata } from '../../main/util/nodeLogUtils';

jest.setTimeout(10000);
describe('Parsing log string testing', () => {
  it('Successfully parses docker log strings with valid timestamps', async () => {
    const logBesu1 =
      '2022-11-12T22:06:50-00:00 2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc';
    const logTekuInfo1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logTekuWarn1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 WARN  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logTekuError1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 ERROR  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logNimbusInfo1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 INF  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logNimbusWarn1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 WRN  - Eth1 chain monitoring failure, restarting topics="eth1"';
    const logNimbusError1 =
      '2022-11-12T20:36:55-00:00 20:36:55.300 ERR  - Eth1 chain monitoring failure, restarting topics="eth1"';
    const logPrysmError1 =
      '2022-11-12T20:36:55-00:00 time="2022-12-15 20:48:46" level=error msg="Could not connect to execution endpoint" error="403 Forbidden: invalid host specified';
    const logNethermindMultiLine1 =
      '2023-03-19T22:50:43-07:00 2023-03-20 05:50:43.8033|***** JSON RPC report *****';
    const logNethermindMultiLine2 =
      'Nethermind loves mutli-line logs. I am the 2nd line without a podman timestamp leading';

    const metadataBesu1 = parsePodmanLogMetadata(logBesu1);
    const metadataTekuInfo1 = parsePodmanLogMetadata(logTekuInfo1);
    const metadataTekuWarn1 = parsePodmanLogMetadata(logTekuWarn1);
    const metadataTekuError1 = parsePodmanLogMetadata(logTekuError1);

    const metadataNimbusInfo1 = parsePodmanLogMetadata(logNimbusInfo1);
    const metadataNimbusWarn1 = parsePodmanLogMetadata(logNimbusWarn1);
    const metadataNimbusError1 = parsePodmanLogMetadata(logNimbusError1);
    const metadataPrysmError1 = parsePodmanLogMetadata(logPrysmError1);

    const metadataNethermindMultiLine1 = parsePodmanLogMetadata(
      logNethermindMultiLine1,
    );
    const metadataNethermindMultiLine2 = parsePodmanLogMetadata(
      logNethermindMultiLine2,
    );

    expect(metadataBesu1).toEqual({
      message:
        '2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc',
      level: 'INFO',
      timestamp: 1668290810000,
    });
    expect(metadataTekuInfo1).toEqual({
      message:
        '20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'INFO',
      timestamp: 1668285415000,
    });
    expect(metadataTekuWarn1).toEqual({
      message:
        '20:36:55.300 WARN  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'WARN',
      timestamp: 1668285415000,
    });
    expect(metadataTekuError1).toEqual({
      message:
        '20:36:55.300 ERROR  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'ERROR',
      timestamp: 1668285415000,
    });
    expect(metadataNimbusInfo1).toEqual({
      message:
        '20:36:55.300 INF  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'INFO',
      timestamp: 1668285415000,
    });
    expect(metadataNimbusWarn1).toEqual({
      message:
        '20:36:55.300 WRN  - Eth1 chain monitoring failure, restarting topics="eth1"',
      level: 'WARN',
      timestamp: 1668285415000,
    });
    expect(metadataNimbusError1).toEqual({
      message:
        '20:36:55.300 ERR  - Eth1 chain monitoring failure, restarting topics="eth1"',
      level: 'ERROR',
      timestamp: 1668285415000,
    });
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
  });
});
