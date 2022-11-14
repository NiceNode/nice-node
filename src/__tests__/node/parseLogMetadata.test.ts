import { parseDockerLogMetadata } from '../../main/util/nodeLogUtils';

jest.setTimeout(10000);
describe('Parsing log string testing', () => {
  it('Successfully parses docker log strings with valid timestamps', async () => {
    const logBesu1 =
      '2022-11-12T22:06:50.398994845Z 2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc';
    const logTeku1 =
      '2022-11-12T20:36:55.301070423Z 20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ';

    const metadataBesu1 = parseDockerLogMetadata(logBesu1);
    const metadataTeku1 = parseDockerLogMetadata(logTeku1);

    expect(metadataBesu1).toEqual({
      message:
        '2022-11-12 22:06:50.398+00:00 | main | INFO  | Besu | Using jemalloc',
      level: 'INFO',
      timestamp: 1668290810398,
    });
    expect(metadataTeku1).toEqual({
      message:
        '20:36:55.300 INFO  - Local ENR: enr:-Iu4QLmcCCdh2Q8P5_05y2RD1kq1ZafcbKZzZywmPRRkSTIBGZ6XoXgTBWV2FNVhY7AKHgbvkZK2veQchEowqNMLKgIIhGV0aDKQSibFiwIAAAD__________4JpZIJ2NIlzZWNwMjU2azGhAgQdda3wTusVS5M5qesnIV8CsnNq6Nrzgy4I9Ui2spdZ',
      level: 'INFO',
      timestamp: 1668285415301,
    });
  });
});
