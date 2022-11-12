const Timestamp = require('../../main/util/timestamp');

jest.setTimeout(10000);
describe('Parsing nano second timestamp string testing', () => {
  it('Successfully parses valid strings', async () => {
    const string1 = '2022-11-12T21:01:01.751975587Z';
    const string2 = '2022-11-12T21:01:02.864469421Z';
    const string3 = '2017-11-26T13:36:22.213Z';
    const string4 = '2004-11-09T08:35:11.864469421Z';

    const timestamp1 = Timestamp.fromString(string1).time;
    const timestamp2 = Timestamp.fromString(string2).time;
    const timestamp3 = Timestamp.fromString(string3).time;
    const timestamp4 = Timestamp.fromString(string4).time;

    expect(timestamp1).toBe(1668286861751);
    expect(timestamp2).toBe(1668286862864);
    expect(timestamp3).toBe(1511703382213);
    expect(timestamp4).toBe(1099989311864);
  });
});
