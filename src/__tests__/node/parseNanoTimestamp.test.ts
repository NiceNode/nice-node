import { isNanoDateTimeWithTimezone } from '../../main/util/nodeLogUtils';
import { timestampFromString } from '../../main/util/timestamp';
import { describe, it, expect } from 'vitest';

describe('Parsing nano second timestamp string testing', () => {
  it('Successfully parses valid strings', async () => {
    const string1 = '2022-11-12T21:01:01.751975587Z';
    const string2 = '2022-11-12T21:01:02.864469421Z';
    const string3 = '2017-11-26T13:36:22.213Z';
    const string4 = '2004-11-09T08:35:11.864469421Z';

    const stringNano1 = '2023-10-12T08:08:14.052426000-07:00';

    const timestamp1 = timestampFromString(string1);
    const timestamp2 = timestampFromString(string2);
    const timestamp3 = timestampFromString(string3);
    const timestamp4 = timestampFromString(string4);

    const timestampNano1 = timestampFromString(stringNano1);

    expect(timestamp1).toBe(1668286861751);
    expect(timestamp2).toBe(1668286862864);
    expect(timestamp3).toBe(1511703382213);
    expect(timestamp4).toBe(1099989311864);

    expect(timestampNano1).toBe(1697123294052);
  });
});

describe('Parsing isNanoDateTimeWithTimezone', () => {
  it('Successfully parses valid strings as true', async () => {
    const string1 =
      '2023-10-12T08:33:16.384713000-07:00 {"level":30,"time":1697124796384,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359078282788864,"fid":4286,"type":"CAST_ADD","hash":"0x86f91d1fd6d4a6ee7c67620a104781b33e6ad6e0","source":"gossip","msg":"submitMessage success"}';

    expect(isNanoDateTimeWithTimezone(string1)).toBeTruthy();

    const string2 = '2023-10-12T08:33:16.384713000-07:00logisrightafter';

    expect(isNanoDateTimeWithTimezone(string2)).toBeTruthy();
  });
  it('Successfully parses invalid strings as false', async () => {
    const string1 =
      '2023-10-12T08:33:16.384713000 {"level":30,"time":1697124796384,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359078282788864,"fid":4286,"type":"CAST_ADD","hash":"0x86f91d1fd6d4a6ee7c67620a104781b33e6ad6e0","source":"gossip","msg":"submitMessage success"}';

    expect(isNanoDateTimeWithTimezone(string1)).toBeFalsy();

    const string2 =
      '2023-10-12T08:33:16.384713000 {"level":30,"time":1697124796384,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359078282788864,"fid":4286,"type":"CAST_ADD","hash":"0x86f91d1fd6d4a6ee7c67620a104781b33e6ad6e0","source":"gossip","msg":"submitMessage success"}';

    expect(isNanoDateTimeWithTimezone(string2)).toBeFalsy();
    const string3 =
      '2004-11-09T08:35:11.864469421Z {"level":30,"time":1697124796384,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359078282788864,"fid":4286,"type":"CAST_ADD","hash":"0x86f91d1fd6d4a6ee7c67620a104781b33e6ad6e0","source":"gossip","msg":"submitMessage success"}';

    expect(isNanoDateTimeWithTimezone(string3)).toBeFalsy();
    const string4 =
      '2017-11-26T13:36:22.213Z {"level":30,"time":1697124796384,"pid":1,"hostname":"fa7503bb34e7","component":"Hub","eventId":359078282788864,"fid":4286,"type":"CAST_ADD","hash":"0x86f91d1fd6d4a6ee7c67620a104781b33e6ad6e0","source":"gossip","msg":"submitMessage success"}';

    expect(isNanoDateTimeWithTimezone(string4)).toBeFalsy();
  });
});
