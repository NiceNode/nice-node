import { timestampFromString } from '../../main/util/timestamp';

jest.setTimeout(10000);
describe('Parsing nano second timestamp string testing', () => {
  it('Successfully parses valid strings', async () => {
    const string1 = '2022-11-12T21:01:01.751975587Z';
    const string2 = '2022-11-12T21:01:02.864469421Z';
    const string3 = '2017-11-26T13:36:22.213Z';
    const string4 = '2004-11-09T08:35:11.864469421Z';

    const timestamp1 = timestampFromString(string1);
    const timestamp2 = timestampFromString(string2);
    const timestamp3 = timestampFromString(string3);
    const timestamp4 = timestampFromString(string4);

    expect(timestamp1).toBe(1668286861751);
    expect(timestamp2).toBe(1668286862864);
    expect(timestamp3).toBe(1511703382213);
    expect(timestamp4).toBe(1099989311864);
  });
});
