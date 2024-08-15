import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { NodeId } from 'src/common/node.js';
import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
import { Header } from '../../Generics/redesign/Header/Header';
import { HeaderMetrics } from '../../Generics/redesign/HeaderMetrics/HeaderMetrics';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import { Message } from '../../Generics/redesign/Message/Message';
import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import type {
  ClientProps,
  NodeOverviewProps,
} from '../../Generics/redesign/consts';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodeId } from '../../state/node';
import type { SingleNodeContent } from '../ContentSingleClient/ContentSingleClient';
import {
  clientCardsContainer,
  container,
  promptContainer,
  resourcesContainer,
  sectionDescription,
  sectionTitle,
} from './contentMultipleClients.css';

const ContentMultipleClients = (props: {
  clients: ClientProps[];
  nodeContent: SingleNodeContent | undefined;
  isPodmanRunning: boolean;
}) => {
  const { clients, nodeContent, isPodmanRunning } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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

  const onAction = useCallback((action: any, nodeId: NodeId) => {
    // todo: handle nodeContent.nodeId undefined error
    if (!nodeId) {
      return;
    }
    if (action === 'start') {
      electron.startNodePackage(nodeId);
    } else if (action === 'stop') {
      electron.stopNodePackage(nodeId);
    }
  }, []);

  const elClient = clients.find(
    (client) => client.serviceId === 'executionClient',
  );
  const clClient = clients.find(
    (client) => client.serviceId === 'consensusClient',
  );

  const resourceData = useMemo(() => {
    const resourceData: { title: string; items: any[] } = {
      title: t('MoreResources'),
      items: [],
    };

    clients.forEach((client) => {
      const clientResource = client?.resources;
      if (clientResource) {
        resourceData.items.push({
          sectionTitle: client.displayName,
          items: client.resources,
        });
      }
    });

    const nodePackageResource = nodeContent?.resources;
    if (nodePackageResource) {
      resourceData.items.push({
        sectionTitle: `${nodeContent.displayName} ${t('Node')}`,
        items: nodePackageResource,
      });
    }

    return resourceData;
  }, [clients, t, nodeContent]);

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
      // !clClient?.status.initialized &&
      // !elClient?.status.initialized &&
      !synchronized &&
      !initialSyncMessageDismissed
    ) {
      return (
        <Message
          type="info"
          title={t('InitialSyncStarted')}
          description={t('InitialSyncDescription')}
          onClick={() => {
            localStorage.setItem('initialSyncMessageDismissed', 'true');
            setinitialSyncMessageDismissed(true);
          }}
        />
      );
    }
    return null;
  };

  const nodeOverview = useMemo(() => {
    // useEffect, used only in Header and Metrics

    // TODO: loop over all node's services/clients for missing statuses in nodeOverview
    // if (clClient && elClient) {
    //   // Ethereum Node
    //   nodeOverview = {
    //     name: 'ethereum',
    //     title: 'Ethereum node',
    //     info: 'Non-Validating Node — Ethereum mainnet',
    //     type: 'nodePackage',
    //     status: {
    //       updating: clClient?.status.updating || elClient?.status.updating,
    //       synchronized:
    //         clClient?.status.synchronized && elClient?.status.synchronized,
    //       initialized:
    //         clClient?.status.initialized || elClient?.status.initialized,
    //       blocksBehind:
    //         clClient?.status.blocksBehind || elClient?.status.blocksBehind,
    //       lowPeerCount:
    //         clClient?.status.lowPeerCount || elClient?.status.lowPeerCount,
    //       updateAvailable:
    //         clClient?.status.updateAvailable ||
    //         elClient?.status.updateAvailable,
    //       noConnection:
    //         clClient?.status.noConnection || elClient?.status.noConnection,
    //       stopped: clClient?.status.stopped || elClient?.status.stopped, // both should be stopped
    //       error: clClient?.status.error || elClient?.status.error,
    //     },
    //     stats: {
    //       currentBlock: elClient?.stats.currentBlock,
    //       highestBlock: elClient?.stats.highestBlock,
    //       currentSlot: clClient?.stats.currentSlot,
    //       highestSlot: clClient?.stats.highestSlot,
    //       cpuLoad:
    //         (clClient?.stats.cpuLoad || 0) + (elClient?.stats.cpuLoad || 0),
    //       diskUsageGBs:
    //         (clClient?.stats.diskUsageGBs || 0) +
    //         (elClient?.stats.diskUsageGBs || 0),
    //     },
    //   };
    //   return nodeOverview;
    // }
    // non-Ethereum node conditions added here
    if (!nodeContent) {
      return {};
    }
    const nodeOverview: NodeOverviewProps = {
      name: nodeContent.name,
      nodeId: nodeContent.nodeId,
      title: `${nodeContent.displayName} ${t('Node')}`,
      iconUrl: nodeContent.iconUrl,
      info: nodeContent.info ?? '',
      screenType: 'nodePackage',
      status: nodeContent.status ?? {},
      stats: nodeContent.stats ?? {},
      description: nodeContent.description ?? '',
      onAction,
      rpcTranslation: 'eth-l1', // todo
      releaseNotesUrl: nodeContent.documentation?.releaseNotesUrl,
    };
    return nodeOverview;
  }, [
    JSON.stringify(nodeContent?.nodeId),
    JSON.stringify(nodeContent?.status),
    JSON.stringify(nodeContent?.stats),
  ]);

  const handleClientClick = useCallback(
    (clientId: string | undefined) => {
      console.log('ContentMultipleClients client on click!', clientId);
      dispatch(updateSelectedNodeId(clientId));
      // Added a delay to navigate because NodeScreen can't handle a
      // node change properly here after NodeScreen renders
      setTimeout(() => {
        navigate('/main/node');
      }, 500);
    },
    [dispatch, navigate],
  );

  return (
    <div className={container}>
      <Header
        nodeOverview={nodeOverview as NodeOverviewProps}
        isPodmanRunning={isPodmanRunning}
      />
      <HorizontalLine type="content" />
      <HeaderMetrics {...(nodeOverview as NodeOverviewProps)} />
      <HorizontalLine type="content" />
      <div className={promptContainer}>{renderPrompt()}</div>
      <div className={sectionTitle}>
        {clients.length > 1 ? t('Clients') : t('Client')}
      </div>
      <div className={clientCardsContainer}>
        {clients.map((client) => {
          return (
            <ClientCard
              packageName={nodeContent.name}
              key={client.id}
              {...client}
              onClick={() => handleClientClick(client.id)}
            />
          );
        })}
      </div>
      <HorizontalLine type="content" />
      <div className={sectionTitle}>{t('About')}</div>
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
