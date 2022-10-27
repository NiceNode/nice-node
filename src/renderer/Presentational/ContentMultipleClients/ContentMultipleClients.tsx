import { useState, useCallback } from 'react';
import { ClientProps } from 'renderer/Generics/redesign/consts';
import { Message } from '../../Generics/redesign/Message/Message';
import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { HeaderMetrics } from '../../Generics/redesign/HeaderMetrics/HeaderMetrics';
import { Header } from '../../Generics/redesign/Header/Header';
import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import {
  container,
  sectionTitle,
  sectionDescription,
  clientCardsContainer,
  resourcesContainer,
} from './contentMultipleClients.css';

const ContentMultipleClients = (props: {
  clients: [ClientProps, ClientProps];
}) => {
  const { clients } = props;
  // TODO: Come up with a better name for this component..
  /* TODO: maybe a "provider" wrapper/manager to fetch data and handle states */

  const initialWalletDismissedState =
    localStorage.getItem('walletDismissed') === 'true';
  const initialSyncMessageDismissedState =
    localStorage.getItem('initialSyncMessageDismissed') === 'true';
  const [walletDismissed, setWalletDismissed] = useState<boolean>(
    initialWalletDismissedState
  );
  const [initialSyncMessageDismissed, setinitialSyncMessageDismissed] =
    useState<boolean>(initialSyncMessageDismissedState);

  const onDismissClick = useCallback(() => {
    setWalletDismissed(true);
    localStorage.setItem('walletDismissed', 'true');
  }, []);

  const onSetupClick = useCallback(() => {
    // TODO: open wallet screen
    onDismissClick();
  }, []);

  const clClient = clients.find((client) => client.nodeType === 'consensus');
  const elClient = clients.find((client) => client.nodeType === 'execution');

  const renderPrompt = () => {
    if (
      clClient?.status.synchronizing >= 98 &&
      elClient?.status.synchronizing >= 98 &&
      !walletDismissed
    ) {
      return (
        <WalletPrompt
          onSetupClick={onSetupClick}
          onDismissClick={onDismissClick}
        />
      );
    }
    if (
      !clClient?.status.initialized &&
      !elClient?.status.initialized &&
      clClient?.status.synchronizing < 98 &&
      elClient?.status.synchronizing < 98 &&
      !initialSyncMessageDismissed
    ) {
      const title = 'Initial sync process started';
      const description =
        'When adding a node it first needs to catch up on the history of the network. This process downloads all the necessary data and might take a couple of days. After synchronization is complete your node will be online and part of the network.';
      return (
        <Message
          type="info"
          title={title}
          description={description}
          onClick={() => {
            localStorage.setItem('initialSyncMessageDismissed', 'true');
            setinitialSyncMessageDismissed(true);
          }}
        />
      );
    }
    return null;
  };

  // TODO: refactor this out so that it can be shared with multiple and single
  const getNodeOverview = () => {
    // useEffect, used only in Header and Metrics
    let nodeOverview = {};

    if (clClient && elClient) {
      // Ethereum Altruistic Node
      nodeOverview = {
        name: 'ethereum',
        title: 'Ethereum node',
        info: 'Non-Validating Node — Ethereum mainnet',
        type: 'altruistic',
        status: {
          initialized:
            clClient?.status.initialized || elClient?.status.initialized,
          synchronizing:
            clClient?.status.synchronizing || elClient?.status.synchronizing,
          lowPeerCount:
            clClient?.status.lowPeerCount || elClient?.status.lowPeerCount,
          updateAvailable:
            clClient?.status.updateAvailable ||
            elClient?.status.updateAvailable,
          blocksBehind:
            clClient?.status.blocksBehind || elClient?.status.blocksBehind,
          noConnection:
            clClient?.status.noConnection || elClient?.status.noConnection,
          stopped: clClient?.status.stopped || elClient?.status.stopped, // both should be stopped
          error: clClient?.status.error || elClient?.status.error,
        },
        stats: {
          block: clClient?.stats.slot,
          cpuLoad:
            (clClient?.stats.cpuLoad || 0) + (elClient?.stats.cpuLoad || 0),
          diskUsage:
            (clClient?.stats.diskUsage || 0) + (elClient?.stats.diskUsage || 0),
        },
      };
      return nodeOverview;
    }
    // non-Ethereum node conditions added here
    return clients[0];
  };

  const getResourceData = () => {
    const resourceData = {
      title: 'More resources',
      items: [],
    };
    const resourceJson = require('./resources.json');
    const clientNames = clients.map((client) => {
      return client.name;
    });
    // Look through json and find exact client resource data
    clientNames.forEach((value, index, array) => {
      const clientSearch = (clientString: string) =>
        resourceJson.find((clientObject) => clientObject.key === clientString);
      const found = clientSearch(value);
      if (found) {
        resourceData.items.push(found);
      }
    });
    if (clClient || elClient) {
      // Altruistic node, so add Ethereum information at end
      resourceData.items.push(resourceJson[0]);
    }
    return resourceData;
  };

  const nodeOverview = getNodeOverview();
  const resourceData = getResourceData();

  return (
    <div className={container}>
      <Header {...nodeOverview} />
      <HorizontalLine type="content" />
      <HeaderMetrics {...nodeOverview} />
      <HorizontalLine type="content" />
      {renderPrompt()}
      <div className={sectionTitle}>Ethereum Clients</div>
      <div className={clientCardsContainer}>
        {clients.map((client) => {
          return <ClientCard {...client} />;
        })}
      </div>
      <HorizontalLine type="content" />
      <div className={sectionTitle}>About</div>
      <div className={sectionDescription}>
        <p>
          An Ethereum node holds a copy of the Ethereum blockchain and verifies
          the validity of every block, keeps it up-to-date with new blocks and
          helps others to download and update their own copies of the chain.
        </p>
        <p>
          In the case of Ethereum a node consists of two parts: the execution
          client and the consensus client. These two clients work together to
          verify Ethereum's state. The execution client listens to new
          transactions broadcasted in the network, executes them in EVM, and
          holds the latest state and database of all current Ethereum data. The
          consensus client runs the Proof-of-Stake consensus algorithm, which
          enables the network to achieve agreement based on validated data from
          the execution client.
        </p>
        <p>
          A non-validating node does not get financial rewards but there are
          many benefits of running a node for any Ethereum user to consider,
          including privacy, security, reduced reliance on third-party servers,
          censorship resistance and improved health and decentralization of the
          network.
        </p>
      </div>
      <div className={resourcesContainer}>
        <LabelValues {...resourceData} column />
      </div>
    </div>
  );
};
export default ContentMultipleClients;
