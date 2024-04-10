import { describe, expect, it } from 'vitest';
import { parseDockerLogMetadata } from '../../main/util/nodeLogUtils';

describe('Parsing log string testing', () => {
  it('Successfully parses docker log strings with valid timestamps', async () => {
    const logBesu1 =
      '2022-11-12T22:06:50.398994845Z 2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc';
    const logTekuInfo1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logTekuWarn1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 WARN  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logTekuError1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 ERROR  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logNimbusInfo1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 INF  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';
    const logNimbusWarn1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 WRN  - Eth1 chain monitoring failure, restarting topics="eth1"';
    const logNimbusError1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 ERR  - Eth1 chain monitoring failure, restarting topics="eth1"';
    const logPrysmError1 =
      '2022-11-12T20:36:55.301070423Z time="2022-12-15 20:48:46" level=error msg="Could not connect to execution endpoint" error="403 Forbidden: invalid host specified';

    const metadataBesu1 = parseDockerLogMetadata(logBesu1);
    const metadataTekuInfo1 = parseDockerLogMetadata(logTekuInfo1);
    const metadataTekuWarn1 = parseDockerLogMetadata(logTekuWarn1);
    const metadataTekuError1 = parseDockerLogMetadata(logTekuError1);

    const metadataNimbusInfo1 = parseDockerLogMetadata(logNimbusInfo1);
    const metadataNimbusWarn1 = parseDockerLogMetadata(logNimbusWarn1);
    const metadataNimbusError1 = parseDockerLogMetadata(logNimbusError1);
    const metadataPrysmError1 = parseDockerLogMetadata(logPrysmError1);

    expect(metadataBesu1).toEqual({
      message:
        '2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc',
      level: 'INFO',
      timestamp: 1668290810398,
    });
    expect(metadataTekuInfo1).toEqual({
      message:
        '20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'INFO',
      timestamp: 1668285415301,
    });
    expect(metadataTekuWarn1).toEqual({
      message:
        '20:36:55.300 WARN  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'WARN',
      timestamp: 1668285415301,
    });
    expect(metadataTekuError1).toEqual({
      message:
        '20:36:55.300 ERROR  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'ERROR',
      timestamp: 1668285415301,
    });
    expect(metadataNimbusInfo1).toEqual({
      message:
        '20:36:55.300 INF  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'INFO',
      timestamp: 1668285415301,
    });
    expect(metadataNimbusWarn1).toEqual({
      message:
        '20:36:55.300 WRN  - Eth1 chain monitoring failure, restarting topics="eth1"',
      level: 'WARN',
      timestamp: 1668285415301,
    });
    expect(metadataNimbusError1).toEqual({
      message:
        '20:36:55.300 ERR  - Eth1 chain monitoring failure, restarting topics="eth1"',
      level: 'ERROR',
      timestamp: 1668285415301,
    });
    expect(metadataPrysmError1).toEqual({
      message:
        'time="2022-12-15 20:48:46" level=error msg="Could not connect to execution endpoint" error="403 Forbidden: invalid host specified',
      level: 'ERROR',
      timestamp: 1668285415301,
    });
  });
});
