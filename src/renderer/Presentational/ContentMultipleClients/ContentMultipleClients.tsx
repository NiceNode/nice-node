import { useState, useCallback } from 'react';
import {
  ClientProps,
  NodeOverviewProps,
} from 'renderer/Generics/redesign/consts';
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
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'renderer/state/hooks';
import { updateSelectedNodeId } from 'renderer/state/node';
import { SingleNodeContent } from '../ContentSingleClient/ContentSingleClient';
import electron from '../../electronGlobal';

const resourceJson = require('./resources.json');

const ContentMultipleClients = (props: {
  clients: ClientProps[] | undefined;
  nodeContent: SingleNodeContent | undefined;
}) => {
  const { clients, nodeContent } = props;
  if (!clients || clients.length < 2) {
    return <>2 or more clients required</>;
  }
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // TODO: Come up with a better name for this component..
  /* TODO: maybe a "provider" wrapper/manager to fetch data and handle states */

  const initialWalletDismissedState =
    localStorage.getItem('walletDismissed') === 'true';
  const initialSyncMessageDismissedState =
    localStorage.getItem('initialSyncMessageDismissed') === 'true';
  const [walletDismissed, setWalletDismissed] = useState<boolean>(
    initialWalletDismissedState,
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
  }, [onDismissClick]);

  const clClient = clients.find((client) => client.nodeType === 'consensus');
  const elClient = clients.find((client) => client.nodeType === 'execution');

  const renderPrompt = () => {
    const synchronized =
      clClient?.status.synchronized && elClient?.status.synchronized;
    if (
      synchronized &&
      !clClient?.status.updating &&
      !elClient?.status.updating &&
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
      !synchronized &&
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

  const onAction = useCallback(
    (action: any) => {
      // todo: handle nodeContent.nodeId undefined error
      if (action === 'start') {
        nodeContent?.nodeId && electron.startNodePackage(nodeContent?.nodeId);
      } else if (action === 'stop') {
        nodeContent?.nodeId && electron.stopNodePackage(nodeContent?.nodeId);
      }
    },
    [nodeContent],
  );

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
          updating: clClient?.status.updating || elClient?.status.updating,
          synchronized:
            clClient?.status.synchronized && elClient?.status.synchronized,
          initialized:
            clClient?.status.initialized || elClient?.status.initialized,
          blocksBehind:
            clClient?.status.blocksBehind || elClient?.status.blocksBehind,
          lowPeerCount:
            clClient?.status.lowPeerCount || elClient?.status.lowPeerCount,
          updateAvailable:
            clClient?.status.updateAvailable ||
            elClient?.status.updateAvailable,
          noConnection:
            clClient?.status.noConnection || elClient?.status.noConnection,
          stopped: clClient?.status.stopped || elClient?.status.stopped, // both should be stopped
          error: clClient?.status.error || elClient?.status.error,
        },
        stats: {
          currentBlock: elClient?.stats.currentBlock,
          highestBlock: elClient?.stats.highestBlock,
          currentSlot: clClient?.stats.currentSlot,
          highestSlot: clClient?.stats.highestSlot,
          cpuLoad:
            (clClient?.stats.cpuLoad || 0) + (elClient?.stats.cpuLoad || 0),
          diskUsageGBs:
            (clClient?.stats.diskUsageGBs || 0) +
            (elClient?.stats.diskUsageGBs || 0),
        },
      };
      return nodeOverview;
    }
    // non-Ethereum node conditions added here
    if (!nodeContent) return;
    nodeOverview = {
      name: nodeContent.name,
      title: `${nodeContent.displayName} node`,
      info: nodeContent.info,
      screenType: 'altruistic',
      status: nodeContent.status,
      stats: nodeContent.stats,
      description: nodeContent.description,
      onAction,
    };
    return nodeOverview;
  };

  const getResourceData = () => {
    // eslint-disable-next-line
    const resourceData: { title: string; items: any[] } = {
      title: 'More resources',
      items: [],
    };
    const clientNames = clients.map((client) => {
      return client.name;
    });
    // Look through json and find exact client resource data
    clientNames.forEach((value) => {
      const clientSearch = (clientString: string) =>
        resourceJson.find(
          (clientObject: { key: string }) => clientObject.key === clientString,
        );
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

  // todo2: call start/stop node package

  // todo2: call remove node package

  return (
    <div className={container}>
      <Header {...(nodeOverview as NodeOverviewProps)} />
      <HorizontalLine type="content" />
      <HeaderMetrics {...(nodeOverview as NodeOverviewProps)} />
      <HorizontalLine type="content" />
      {renderPrompt()}
      <div className={sectionTitle}>Clients</div>
      <div className={clientCardsContainer}>
        {clients.map((client) => {
          return (
            <ClientCard
              {...client}
              onClick={() => {
                console.log(
                  'ContentMultipleClients client on click!',
                  client.id,
                );
                dispatch(updateSelectedNodeId(client.id));
                setTimeout(() => {
                  navigate('/main/node');
                }, 500);
              }}
            />
          );
        })}
      </div>
      <HorizontalLine type="content" />
      <div className={sectionTitle}>About</div>
      <div className={sectionDescription}>
        <p>{nodeContent?.description}</p>
      </div>
      <div className={resourcesContainer}>
        <LabelValues {...resourceData} column />
      </div>
    </div>
  );
};
export default ContentMultipleClients;
