import { Header } from '../../Generics/redesign/Header/Header';
import { container } from './contentClients.css';

const clientsData = {
  iconId: 'ethereum',
  version: 'V0.41.0',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
  running: true,
  update: true,
  multiple: true,
};

// TODO: Come up with a better name for this component..
const ContentClients = () => {
  return (
    <div className={container}>
      <Header {...clientsData} />
    </div>
  );
};
export default ContentClients;
