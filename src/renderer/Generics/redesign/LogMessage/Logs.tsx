import { SetStateAction, useState } from 'react';
import moment from 'moment';
import {
  container,
  contentHeader,
  filterContainer,
  textFilterContainer,
  typeFilterContainer,
  timeframeFilterContainer,
  filterMenu,
  logsContainer,
} from './logs.css';
import { Menu } from '../Menu/Menu';
import { MenuItem } from '../MenuItem/MenuItem';
import { LogMessage } from './LogMessage';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { HeaderButton } from '../HeaderButton/HeaderButton';
import { ContentHeader } from '../ContentHeader/ContentHeader';

const timeframes = {
  '30MINUTES': 30,
  '1HOUR': 60,
  '6HOURS': 360,
  '12HOURS': 720,
  '1DAY': 1440,
  '3DAYS': 4320,
  '1WEEK': 10080,
  '1MONTH': 43800,
};

const isWithinTimeframe = (timestamp: number, timeframe: number) => {
  const nowTime = moment().format();
  const beforeTime = moment().subtract(timeframe, 'minutes').format();
  return moment(timestamp).isBetween(beforeTime, nowTime);
};

export const Logs = () => {
  const sLogs = [
    {
      message:
        '2022-11-04 21:41:44.170+00:00 | main | INFO  | Besu | Using LibEthPairings native alt bn128',
      level: 'INFO',
      timestamp: 1667598104174,
    },
    {
      message:
        '2022-11-04 21:41:44.173+00:00 | main | INFO  | Besu | Using the native implementation of the signature algorithm',
      level: 'INFO',
      timestamp: 1667598104174,
    },
    {
      message:
        '2022-11-04 21:41:44.181+00:00 | main | INFO  | Besu | Using the native implementation of the blake2bf algorithm',
      level: 'INFO',
      timestamp: 1667598104181,
    },
    {
      message:
        '2022-11-04 21:41:44.187+00:00 | main | INFO  | Besu | Starting Besu version: besu/v22.10.0/linux-x86_64/openjdk-java-11',
      level: 'INFO',
      timestamp: 1667598104187,
    },
    {
      message:
        '2022-11-04 21:41:44.637+00:00 | main | INFO  | Besu | Engine API authentication enabled without key file. Expect ephemeral jwt.hex file in datadir',
      level: 'INFO',
      timestamp: 1667598104638,
    },
    {
      message:
        '2022-11-04 21:41:44.638+00:00 | main | WARN  | Besu | --graphql-http-host has been ignored because --graphql-http-enabled was not defined on the command line.',
      level: 'WARN',
      timestamp: 1667598104639,
    },
    {
      message:
        '2022-11-04 21:41:44.640+00:00 | main | INFO  | Besu | Static Nodes file = /var/lib/besu/static-nodes.json',
      level: 'INFO',
      timestamp: 1667598104642,
    },
    {
      message:
        '2022-11-04 21:41:44.644+00:00 | main | INFO  | StaticNodesParser | StaticNodes file /var/lib/besu/static-nodes.json does not exist, no static connections will be created.',
      level: 'INFO',
      timestamp: 1667598104645,
    },
    {
      message:
        '2022-11-04 21:41:44.645+00:00 | main | INFO  | Besu | Connecting to 0 static nodes.',
      level: 'INFO',
      timestamp: 1667598104646,
    },
    {
      message:
        '2022-11-04 21:41:44.651+00:00 | main | INFO  | Besu | Security Module: localfile',
      level: 'INFO',
      timestamp: 1667598104651,
    },
    {
      message:
        '2022-11-04 21:41:44.675+00:00 | main | INFO  | RocksDBKeyValueStorageFactory | No existing database detected at /var/lib/besu. Using version 1',
      level: 'INFO',
      timestamp: 1667598104675,
    },
    {
      message:
        '2022-11-04 21:41:46.365+00:00 | main | WARN  | Besu | --tx-pool-future-max-by-account has been deprecated, use --tx-pool-limit-by-account-percentage instead.',
      level: 'WARN',
      timestamp: 1667598106366,
    },
    {
      message:
        '2022-11-04 21:41:46.433+00:00 | main | INFO  | KeyPairUtil | Generated new secp256k1 public key 0x3909aba274f2d0254e79e894ea416c62fd5c81de1b0d836fb85b696af32986d4f6af9615cbac0da5cb23fd51c101962c5a78085371d15760e32d675a763b36c9 and stored it to /var/lib/besu/key',
      level: 'INFO',
      timestamp: 1667598106434,
    },
    {
      message:
        '2022-11-04 21:41:46.679+00:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [Frontier: 0, Homestead: 1150000, DaoRecoveryInit: 1920000, DaoRecoveryTransition: 1920001, Homestead: 1920010, TangerineWhistle: 2463000, SpuriousDragon: 2675000, Byzantium: 4370000, Petersburg: 7280000, Istanbul: 9069000, MuirGlacier: 9200000, Berlin: 12244000, London: 12965000, ArrowGlacier: 13773000, GrayGlacier: 15050000]',
      level: 'INFO',
      timestamp: 1667598106679,
    },
    {
      message:
        '2022-11-04 21:41:46.721+00:00 | main | INFO  | ProtocolScheduleBuilder | Protocol schedule created with milestones: [Frontier: 0, Homestead: 1150000, DaoRecoveryInit: 1920000, DaoRecoveryTransition: 1920001, Homestead: 1920010, TangerineWhistle: 2463000, SpuriousDragon: 2675000, Byzantium: 4370000, Petersburg: 7280000, Istanbul: 9069000, MuirGlacier: 9200000, Berlin: 12244000, London: 12965000, ArrowGlacier: 13773000, GrayGlacier: 15050000]',
      level: 'INFO',
      timestamp: 1667598106722,
    },
    {
      message:
        '2022-11-04 21:41:48.327+00:00 | main | INFO  | TransactionPoolFactory | Enabling transaction pool',
      level: 'INFO',
      timestamp: 1667598108328,
    },
    {
      message:
        '2022-11-04 21:41:48.330+00:00 | main | INFO  | EthPeers | Updating the default best peer comparator',
      level: 'INFO',
      timestamp: 1667598108330,
    },
    {
      message:
        '2022-11-04 21:41:48.351+00:00 | main | INFO  | BesuControllerBuilder | TTD difficulty is present, creating initial sync for PoS',
      level: 'INFO',
      timestamp: 1667598108351,
    },
    {
      message:
        '2022-11-04 21:41:48.391+00:00 | main | INFO  | TransitionBesuControllerBuilder | TTD present, creating DefaultSynchronizer that stops propagating after finalization',
      level: 'INFO',
      timestamp: 1667598108392,
    },
    {
      message:
        '2022-11-04 21:41:48.446+00:00 | main | INFO  | RunnerBuilder | Detecting NAT service.',
      level: 'INFO',
      timestamp: 1667598108447,
    },
    {
      message:
        '2022-11-04 21:41:48.763+00:00 | main | INFO  | Runner | Starting external services ... ',
      level: 'INFO',
      timestamp: 1667598108763,
    },
    {
      message:
        '2022-11-04 21:41:48.764+00:00 | main | INFO  | JsonRpcHttpService | Starting JSON-RPC service on 0.0.0.0:8545',
      level: 'INFO',
      timestamp: 1667598108764,
    },
    {
      message:
        '2022-11-04 21:41:48.897+00:00 | vert.x-eventloop-thread-1 | INFO  | JsonRpcHttpService | JSON-RPC service started and listening on 0.0.0.0:8545',
      level: 'INFO',
      timestamp: 1667598108898,
    },
    {
      message:
        '2022-11-04 21:41:48.898+00:00 | main | INFO  | JsonRpcService | Starting JSON-RPC service on 0.0.0.0:8551',
      level: 'INFO',
      timestamp: 1667598108899,
    },
    {
      message:
        '2022-11-04 21:41:48.907+00:00 | vert.x-eventloop-thread-1 | INFO  | JsonRpcService | JSON-RPC service started and listening on 0.0.0.0:8551',
      level: 'INFO',
      timestamp: 1667598108908,
    },
    {
      message:
        '2022-11-04 21:41:48.909+00:00 | main | INFO  | WebSocketService | Starting Websocket service on 0.0.0.0:8546',
      level: 'INFO',
      timestamp: 1667598108910,
    },
    {
      message:
        '2022-11-04 21:41:48.915+00:00 | vert.x-eventloop-thread-1 | INFO  | WebSocketService | Websocket service started and listening on 0.0.0.0:8546',
      level: 'INFO',
      timestamp: 1667598108915,
    },
    {
      message:
        '2022-11-04 21:41:48.919+00:00 | main | INFO  | AutoTransactionLogBloomCachingService | Starting auto transaction log bloom caching service.',
      level: 'INFO',
      timestamp: 1667598108919,
    },
    {
      message:
        '2022-11-04 21:41:48.928+00:00 | main | INFO  | LogBloomCacheMetadata | Lookup cache metadata file in data directory: /var/lib/besu/caches',
      level: 'INFO',
      timestamp: 1667598108931,
    },
    {
      message:
        '2022-11-04 21:41:48.954+00:00 | main | INFO  | Runner | Starting Ethereum main loop ... ',
      level: 'INFO',
      timestamp: 1667598108955,
    },
    {
      message:
        '2022-11-04 21:41:48.954+00:00 | main | INFO  | NatService | No NAT environment detected so no service could be started',
      level: 'INFO',
      timestamp: 1667598108955,
    },
    {
      message:
        '2022-11-04 21:41:48.954+00:00 | main | INFO  | NetworkRunner | Starting Network.',
      level: 'INFO',
      timestamp: 1667598108955,
    },
    {
      message:
        '2022-11-04 21:41:48.958+00:00 | main | INFO  | DefaultP2PNetwork | Starting DNS discovery with URL enrtree://AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE@all.mainnet.ethdisco.net',
      level: 'INFO',
      timestamp: 1667598108959,
    },
    {
      message:
        '2022-11-04 21:41:49.059+00:00 | nioEventLoopGroup-2-1 | INFO  | RlpxAgent | P2P RLPx agent started and listening on /0.0.0.0:30303.',
      level: 'INFO',
      timestamp: 1667598109060,
    },
    {
      message:
        '2022-11-04 21:41:49.074+00:00 | main | INFO  | PeerDiscoveryAgent | Starting peer discovery agent on host=0.0.0.0, port=30303',
      level: 'INFO',
      timestamp: 1667598109075,
    },
    {
      message:
        '2022-11-04 21:41:49.144+00:00 | vert.x-eventloop-thread-1 | INFO  | VertxPeerDiscoveryAgent | Started peer discovery agent successfully, on effective host=0.0.0.0 and port=30303',
      level: 'INFO',
      timestamp: 1667598109144,
    },
    {
      message:
        '2022-11-04 21:41:49.146+00:00 | main | INFO  | PeerDiscoveryAgent | P2P peer discovery agent started and listening on /0.0.0.0:30303',
      level: 'INFO',
      timestamp: 1667598109147,
    },
    {
      message:
        '2022-11-04 21:41:49.289+00:00 | main | INFO  | PeerDiscoveryAgent | Writing node record to disk. NodeRecord{seq=1, publicKey=0x033909aba274f2d0254e79e894ea416c62fd5c81de1b0d836fb85b696af32986d4, udpAddress=Optional[/127.0.0.1:30303], tcpAddress=Optional[/127.0.0.1:30303], asBase64=-Jq4QNYoVoUVzexfQnLnqtQqQwJp9_fi5lyBZAJyFxkGT9UXJYziTbMvP-17sawmUkNPpHa06ye-F_z3BoMKioHCgeUBg2V0aMrJhPxk7ASDEYwwgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQM5CauidPLQJU556JTqQWxi_VyB3hsNg2-4W2lq8ymG1IN0Y3CCdl-DdWRwgnZf, nodeId=0x1921901c6a2067327bafdc3c00de1f1eb8ae021b397961d3419de43a7a860578, customFields={tcp=30303, udp=30303, ip=0x7f000001, eth=[[0xfc64ec04, 0x118c30]], id=V4, secp256k1=0x033909aba274f2d0254e79e894ea416c62fd5c81de1b0d836fb85b696af32986d4}}',
      level: 'INFO',
      timestamp: 1667598109290,
    },
    {
      message:
        '2022-11-04 21:41:49.490+00:00 | main | INFO  | DefaultP2PNetwork | Enode URL enode://3909aba274f2d0254e79e894ea416c62fd5c81de1b0d836fb85b696af32986d4f6af9615cbac0da5cb23fd51c101962c5a78085371d15760e32d675a763b36c9@127.0.0.1:30303',
      level: 'INFO',
      timestamp: 1667598109491,
    },
    {
      message:
        '2022-11-04 21:41:49.491+00:00 | main | INFO  | DefaultP2PNetwork | Node address 0x00de1f1eb8ae021b397961d3419de43a7a860578',
      level: 'INFO',
      timestamp: 1667598109493,
    },
    {
      message:
        '2022-11-04 21:41:49.512+00:00 | main | INFO  | DefaultSynchronizer | Starting synchronizer.',
      level: 'INFO',
      timestamp: 1667598109513,
    },
    {
      message:
        '2022-11-04 21:41:49.525+00:00 | main | INFO  | FullSyncDownloader | Starting full sync.',
      level: 'INFO',
      timestamp: 1667598109526,
    },
    {
      message:
        '2022-11-04 21:41:49.526+00:00 | main | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 0',
      level: 'INFO',
      timestamp: 1667598109527,
    },
    {
      message:
        '2022-11-04 21:41:49.542+00:00 | main | INFO  | Runner | Ethereum main loop is up.',
      level: 'INFO',
      timestamp: 1667598109543,
    },
    {
      message:
        '2022-11-04 21:41:50.084+00:00 | nioEventLoopGroup-3-1 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 1',
      level: 'INFO',
      timestamp: 1667598110084,
    },
    {
      message:
        '2022-11-04 21:41:50.349+00:00 | nioEventLoopGroup-3-5 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 1',
      level: 'INFO',
      timestamp: 1667598110350,
    },
    {
      message:
        '2022-11-04 21:41:55.330+00:00 | EthScheduler-Timer-0 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 3',
      level: 'INFO',
      timestamp: 1667598115330,
    },
    {
      message:
        '2022-11-04 21:41:55.483+00:00 | nioEventLoopGroup-3-5 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 3',
      level: 'INFO',
      timestamp: 1667598115484,
    },
    {
      message:
        '2022-11-04 21:42:00.257+00:00 | nioEventLoopGroup-3-4 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 4',
      level: 'INFO',
      timestamp: 1667598120259,
    },
    {
      message:
        '2022-11-04 21:42:05.261+00:00 | EthScheduler-Timer-0 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 2',
      level: 'INFO',
      timestamp: 1667598125262,
    },
    {
      message:
        '2022-11-04 21:42:06.943+00:00 | nioEventLoopGroup-3-10 | INFO  | FullSyncTargetManager | No sync target, waiting for peers. Current peers: 3',
      level: 'INFO',
      timestamp: 1667598126944,
    },
    {
      message:
        '2022-11-04 21:42:10.840+00:00 | BesuCommand-Shutdown-Hook | INFO  | DefaultSynchronizer | Stopping synchronizer',
      level: 'INFO',
      timestamp: 1667598130841,
    },
    {
      message:
        '2022-11-04 21:42:10.843+00:00 | BesuCommand-Shutdown-Hook | INFO  | NetworkRunner | Stopping Network.',
      level: 'INFO',
      timestamp: 1667598130843,
    },
    {
      message:
        '2022-11-04 21:42:10.857+00:00 | BesuCommand-Shutdown-Hook | INFO  | EthProtocolManager | Stopping eth Subprotocol.',
      level: 'INFO',
      timestamp: 1667598130857,
    },
    {
      message:
        '2022-11-04 21:42:10.957+00:00 | BesuCommand-Shutdown-Hook | INFO  | EthProtocolManager | eth Subprotocol stopped.',
      level: 'INFO',
      timestamp: 1667598130958,
    },
    {
      message:
        '2022-11-04 21:42:10.957+00:00 | BesuCommand-Shutdown-Hook | INFO  | NetworkRunner | Network stopped.',
      level: 'INFO',
      timestamp: 1667598130958,
    },
    {
      message:
        '2022-11-04 21:42:10.958+00:00 | BesuCommand-Shutdown-Hook | INFO  | AutoTransactionLogBloomCachingService | Shutting down Auto transaction logs caching service.',
      level: 'INFO',
      timestamp: 1667598130959,
    },
    {
      message:
        '2022-11-04 21:42:10.960+00:00 | BesuCommand-Shutdown-Hook | INFO  | NatService | No NAT environment detected so no service could be stopped',
      level: 'INFO',
      timestamp: 1667598130961,
    },
    {
      message:
        '2022-11-13 21:42:11.041+00:00 | main | INFO  | Besu | Using jemalloc',
      level: 'INFO',
      timestamp: 1668461782022,
    },
  ];

  const [isFilterBarDisplayed, setIsFilterBarDisplayed] =
    useState<boolean>(false);
  const [isTypeFilterDisplayed, setIsTypeFilterDisplayed] =
    useState<boolean>(false);
  const [isTimeframeFilterDisplayed, setIsTimeframeFilterDisplayed] =
    useState<boolean>(false);
  const [timeframeFilter, setTimeframeFilter] = useState<number>(0);
  const [textFilter, setTextFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const onClickSetTypeFilter = (type: string) => {
    if (typeFilter !== '') {
      setTypeFilter('');
    } else {
      setTypeFilter(type);
    }
  };
  const onClickSetTimeframeFilter = (timeframe: SetStateAction<number>) => {
    if (timeframeFilter !== 0 && timeframeFilter === timeframe) {
      setTimeframeFilter(0);
    } else {
      setTimeframeFilter(timeframe);
    }
  };

  const filteredLogMessages = sLogs
    .filter((log: any) => {
      if (
        (typeFilter === '' || log.level === typeFilter) &&
        (textFilter === '' || log.message.includes(textFilter)) &&
        (timeframeFilter === 0 ||
          isWithinTimeframe(log.timestamp, timeframeFilter))
      ) {
        return true;
      }
      return false;
    })
    .map((log) => <LogMessage {...log} />);

  return (
    <>
      <div className={container}>
        <div
          className={contentHeader}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsFilterBarDisplayed(false);
            }
          }}
        >
          <ContentHeader
            textAlign="left"
            title="Logs"
            leftButtonIconId="down"
            rightButtonIconId="filter"
            rightButtonOnClick={() => {
              if (isFilterBarDisplayed) {
                setIsFilterBarDisplayed(false);
              } else {
                setIsFilterBarDisplayed(true);
              }
            }}
          />
          {isFilterBarDisplayed && (
            <div className={filterContainer}>
              <div className={textFilterContainer}>
                <Input
                  value={textFilter}
                  placeholder="Search..."
                  onChange={(text: string) => {
                    setTextFilter(text);
                  }}
                />
              </div>
              <div
                className={typeFilterContainer}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsTypeFilterDisplayed(false);
                  }
                }}
              >
                <Button
                  wide
                  iconId="down"
                  size="small"
                  variant="icon-right"
                  label="All message types"
                  onClick={() => {
                    if (isTypeFilterDisplayed) {
                      setIsTypeFilterDisplayed(false);
                    } else {
                      setIsTypeFilterDisplayed(true);
                    }
                  }}
                />
                {isTypeFilterDisplayed && (
                  <div className={filterMenu}>
                    <Menu width={158}>
                      <MenuItem
                        variant="checkbox"
                        status="blue"
                        text="Info"
                        onClick={() => onClickSetTypeFilter('INFO')}
                      />
                      <MenuItem
                        variant="checkbox"
                        status="orange"
                        text="Warnings"
                        onClick={() => onClickSetTypeFilter('WARN')}
                      />
                      <MenuItem
                        variant="checkbox"
                        status="red"
                        text="Errors"
                        onClick={() => onClickSetTypeFilter('ERROR')}
                      />
                    </Menu>
                  </div>
                )}
              </div>
              <div
                className={timeframeFilterContainer}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsTimeframeFilterDisplayed(false);
                  }
                }}
              >
                <Button
                  iconId="down"
                  size="small"
                  variant="icon-right"
                  label="Last week"
                  onClick={() => {
                    if (isTimeframeFilterDisplayed) {
                      setIsTimeframeFilterDisplayed(false);
                    } else {
                      setIsTimeframeFilterDisplayed(true);
                    }
                  }}
                />
                {isTimeframeFilterDisplayed && (
                  <div className={filterMenu}>
                    <Menu width={148}>
                      <MenuItem
                        text="Last 30 minutes"
                        selectable
                        selected={timeframeFilter === timeframes['30MINUTES']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['30MINUTES'])
                        }
                      />
                      <MenuItem
                        text="Last hour"
                        selectable
                        selected={timeframeFilter === timeframes['1HOUR']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1HOUR'])
                        }
                      />
                      <MenuItem
                        text="Last 6 hours"
                        selectable
                        selected={timeframeFilter === timeframes['6HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['6HOURS'])
                        }
                      />
                      <MenuItem
                        text="Last 12 hours"
                        selectable
                        selected={timeframeFilter === timeframes['12HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['12HOURS'])
                        }
                      />
                      <MenuItem
                        text="Last day"
                        selectable
                        selected={timeframeFilter === timeframes['1DAY']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1DAY'])
                        }
                      />
                      <MenuItem
                        text="Last 3 days"
                        selectable
                        selected={timeframeFilter === timeframes['3DAYS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['3DAYS'])
                        }
                      />
                      <MenuItem
                        text="Last week"
                        selectable
                        selected={timeframeFilter === timeframes['1WEEK']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1WEEK'])
                        }
                      />
                      <MenuItem
                        text="Last month"
                        selectable
                        selected={timeframeFilter === timeframes['1MONTH']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1MONTH'])
                        }
                      />
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={logsContainer}>{filteredLogMessages}</div>
      </div>
    </>
  );
};
