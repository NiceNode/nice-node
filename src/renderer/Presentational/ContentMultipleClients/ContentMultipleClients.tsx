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
  version: 'V0.41.0',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
  running: true,
  update: true,
  multiple: true,
};

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
  // TODO: Continuously fetch stats from both nodes, pass down props
  // TODO: Come up with a better name for this component..
  // TODO: Refactor to support single node view

  const initialDismissedState =
    localStorage.getItem('walletDismissed') === 'true';
  const [walletDismissed, setWalletDismissed] = useState(initialDismissedState);

  const onDismissClick = useCallback(() => {
    setWalletDismissed(true);
    localStorage.setItem('walletDismissed', 'true');
  }, []);

  const onSetupClick = useCallback(() => {
    // open wallet screen
    onDismissClick();
  }, []);

  return (
    <div className={container}>
      <Header {...clientsData} />
      <HorizontalLine type="content" />
      <HeaderMetrics status="healthy" type="altruistic" />
      <HorizontalLine type="content" />
      {!walletDismissed && (
        <WalletPrompt
          onSetupClick={onSetupClick}
          onDismissClick={onDismissClick}
        />
      )}
      <div className={sectionTitle}>Ethereum Clients</div>
      <div className={clientCardsContainer}>
        <ClientCard sync name="nimbus" />
        <ClientCard name="besu" />
      </div>
      <HorizontalLine type="content" />
      <div className={sectionTitle}>About</div>
      <div className={sectionDescription}>
        Running an Etherum node is a two part story. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Nunc eget mi vitae augue iaculis tempor
        eget vitae. Running an Etherum node is a two part story. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Nunc eget mi vitae augue
        iaculis tempor eget vitae.
      </div>
      <div className={resourcesContainer}>
        <LabelValues {...resourcesData} column />
      </div>
    </div>
  );
};
export default ContentMultipleClients;
