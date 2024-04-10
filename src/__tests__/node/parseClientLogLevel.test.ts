import { parseLogLevel } from '../../main/util/nodeLogUtils';
import { describe, it, expect } from 'vitest';

describe('Parsing client log level from raw log', () => {
  it('Successfully parses hubble logs', async () => {
    const hubbleInfo =
      '{"level":30,"time":1697057627025,"pid":1,"hostname":"829e630bd7a7","component":"SyncEngine","total":5,"successCount":5,"deferredCount":0,"errCount":0,"msg":"Merged messages during sync"}';
    const hubbleWarn =
      '{"level":40,"time":1697057581070,"pid":1,"hostname":"829e630bd7a7","component":"Hub","event":{"timestamp":1697051990,"name":"sven10","owner":"0x87f1d7250bf2e579cf578aab3312738ce89951f7"},"source":"fname-registry","errCode":"bad_request.duplicate","msg":"submitUserNameProof error: proof already exists"}';
    const hubbleError =
      '{"level":50,"time":1697057625289,"pid":1,"hostname":"829e630bd7a7","component":"Hub","eventId":358803149983744,"fid":9135,"type":"REACTION_ADD","hash":"0xd14030a6f621d22142b953cf813dbf9720c3243b","source":"gossip","msg":"submitMessage success"}';
    const hubbleInfoUnformatted = 'hello world';
    const hubbleInfoUnformattedWithErrInLog =
      '{"pid":1,"hostname":"829e630bd7a7","component":"SyncEngine","total":5,"successCount":5,"deferredCount":0,"errCount":0,"msg":"Merged messages during sync"}';

    expect(parseLogLevel(hubbleInfo, 'hubble', hubbleInfo)).toEqual('INFO');
    expect(parseLogLevel(hubbleWarn, 'hubble', hubbleWarn)).toEqual('WARN');
    expect(parseLogLevel(hubbleError, 'hubble', hubbleError)).toEqual('ERROR');
    expect(
      parseLogLevel(
        hubbleInfoUnformattedWithErrInLog,
        'hubble',
        hubbleInfoUnformattedWithErrInLog,
      ),
    ).toEqual('ERROR');
    expect(
      parseLogLevel(hubbleInfoUnformatted, 'hubble', hubbleInfoUnformatted),
    ).toEqual('INFO');
  });
});
