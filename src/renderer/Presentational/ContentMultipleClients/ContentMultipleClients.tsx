import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { HeaderMetrics } from '../../Generics/redesign/HeaderMetrics/HeaderMetrics';
import { Header } from '../../Generics/redesign/Header/Header';
import {
  container,
  sectionTitle,
  sectionDescription,
  clientCardsContainer,
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

const ContentMultipleClients = () => {
  // TODO: Continuously fetch stats from both nodes, pass down props
  // TODO: Handle wallet prompt decision registry (local storage or session?)
  // TODO: Come up with a better name for this component..
  // TODO: Refactor to support single node view

  return (
    <div className={container}>
      <Header {...clientsData} />
      <HorizontalLine type="content" />
      <HeaderMetrics status="healthy" type="altruistic" />
      <HorizontalLine type="content" />
      <WalletPrompt />
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
    </div>
  );
};
export default ContentMultipleClients;
