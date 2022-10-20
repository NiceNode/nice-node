import { useState, useCallback } from 'react';
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

const clientsData = {
  iconId: 'ethereum',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
  running: true,
  update: true,
  multiple: true,
};

// TODO: process retrieved client data into this format?
const clients = [
  {
    name: 'nimbus',
    version: 'v10',
    type: 'consensus',
    status: {
      synchronized: false,
      lowPeerCount: false,
      updateAvailable: false,
      stopped: false,
    },
  },
  {
    name: 'besu',
    version: 'v10',
    type: 'execution',
    status: {
      synchronized: true,
      lowPeerCount: true,
      updateAvailable: true,
      stopped: false,
    },
  },
];

const resourcesData = {
  title: 'More resources',
  items: [
    {
      sectionTitle: 'Nimbus',
      items: [
        { label: 'Twitter', value: 'ethnimbus', link: 'https://ethereum.org' },
        { label: 'Discord', value: 'Join', link: 'https://ethereum.org' },
        {
          label: 'Website',
          value: 'nimbus.team',
          link: 'https://ethereum.org',
        },
      ],
    },
    {
      sectionTitle: 'Besu',
      items: [
        {
          label: 'Twitter',
          value: '@HyperledgerBesu',
          link: 'https://ethereum.org',
        },
        {
          label: 'Discord',
          value: 'Join',
          link: 'https://ethereum.org',
        },
        {
          label: 'Website',
          value: 'hyperledger.org',
          link: 'https://ethereum.org',
        },
      ],
    },
    {
      sectionTitle: 'Ethereum Node',
      items: [
        {
          label: 'Run your own node',
          value: 'ethereum.org',
          link: 'https://ethereum.org',
        },
        {
          label: 'Learn about client diversity',
          value: 'ethereum.org',
          link: 'https://ethereum.org',
        },
      ],
    },
  ],
};

const ContentMultipleClients = () => {
  // TODO: Come up with a better name for this component..
  /* TODO: Refactor to support single node & eventual validator view,
    maybe with a "provider" wrapper/manager to fetch data and handle states */

  const initialWalletDismissedState =
    localStorage.getItem('walletDismissed') === 'true';
  const [walletDismissed, setWalletDismissed] = useState(
    initialWalletDismissedState
  );

  const onDismissClick = useCallback(() => {
    setWalletDismissed(true);
    localStorage.setItem('walletDismissed', 'true');
  }, []);

  const onSetupClick = useCallback(() => {
    // TODO: open wallet screen
    onDismissClick();
  }, []);

  return (
    <div className={container}>
      <Header {...clientsData} />
      <HorizontalLine type="content" />
      <HeaderMetrics status="healthy" type="altruistic" />
      <HorizontalLine type="content" />
      {!walletDismissed && (
        // TODO: This only shows if *both* clients are fully synced
        // TODO: Prompt handler for wallet & node status messages
        <WalletPrompt
          onSetupClick={onSetupClick}
          onDismissClick={onDismissClick}
        />
      )}
      <div className={sectionTitle}>Ethereum Clients</div>
      <div className={clientCardsContainer}>
        {clients.map((item) => {
          return <ClientCard item={item} />;
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
        <LabelValues {...resourcesData} column />
      </div>
    </div>
  );
};
export default ContentMultipleClients;
