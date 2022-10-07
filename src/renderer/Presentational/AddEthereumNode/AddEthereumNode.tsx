/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
} from './addEthereumNode.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import SpecialSelect from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
import Button from '../../Generics/redesign/Button/Button';
import Input from '../../Generics/redesign/Input/Input';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import Select from '../../Generics/redesign/Select/Select';
import { NodeSpecification } from '../../../common/nodeSpec';

const ecOptions = [
  {
    iconId: 'besu',
    value: 'besu',
    label: 'Besu',
    title: 'Besu',
    info: 'Execution Client',
    minority: true,
  },
  {
    iconId: 'nethermind',
    value: 'nethermind',
    label: 'Nethermind',
    title: 'Nethermind',
    info: 'Execution Client',
    minority: true,
  },

  {
    iconId: 'geth',
    value: 'geth',
    label: 'Geth',
    title: 'Geth',
    info: 'Execution Client',
  },
  // {
  //   iconId: 'erigon',
  //   value: 'erigon',
  //   label: 'Erigon',
  //   title: 'Erigon',
  //   info: 'Execution Client',
  // },
];

const ccOptions = [
  {
    iconId: 'nimbus',
    title: 'Nimbus',
    value: 'nimbus',
    label: 'Nimbus',
    info: 'Consensus Client',
    minority: true,
  },
  {
    iconId: 'teku',
    title: 'Teku',
    info: 'Consensus Client',
    value: 'prysm',
    label: 'Prysm',
    minority: true,
  },
  {
    iconId: 'lighthouse',
    title: 'Lighthouse',
    value: 'lighthouse',
    label: 'Lighthouse',
    info: 'Consensus Client',
  },
  {
    iconId: 'prysm',
    title: 'Prysm',
    info: 'Consensus Client',
    value: 'prysm',
    label: 'Prysm',
  },
  {
    iconId: 'lodestar',
    title: 'Lodestar',
    value: 'lodestar',
    label: 'Lodestar',
    info: 'Consensus Client',
    minority: true,
  },
];

type AddEthereumNodeValues = {
  executionClient?: string;
  consensusClient?: string;
};
export interface AddEthereumNodeProps {
  executionOptions: NodeSpecification[];
  beaconOptions: NodeSpecification[];
  /**
   * Listen to node config changes
   */
  onChange: (newValue: AddEthereumNodeValues) => void;
}

const AddEthereumNode = ({
  onChange,
  executionOptions,
  beaconOptions,
}: AddEthereumNodeProps) => {
  const { t } = useTranslation();
  const [sIsOptionsOpen, setIsOptionsOpen] = useState<boolean>();
  const [sSelectedExecutionClient, setSelectedExecutionClient] =
    useState<string>();
  const [sSelectedConsensusClient, setSelectedConsensusClient] =
    useState<string>();
  // const [sExecutionOptions, setExecutionOptions] = useState<any[]>();
  // const [sBeaconOptions, setBeaconOptions] = useState<any[]>();

  // useEffect(() => {
  //   const formattedExecutionOptions: any[] = [];
  //   executionOptions.forEach((opt) => {
  //     const formattedOption = {
  //       ...opt,
  //       label: opt.displayName,
  //       value: opt.specId,
  //     };
  //     formattedExecutionOptions.push(formattedOption);
  //   });
  //   setExecutionOptions(formattedExecutionOptions);
  // }, [executionOptions]);

  // useEffect(() => {
  //   const formattedBeaconOptions: any[] = [];
  //   beaconOptions.forEach((opt) => {
  //     const formattedOption = {
  //       ...opt,
  //       label: opt.displayName,
  //       value: opt.specId,
  //     };
  //     formattedBeaconOptions.push(formattedOption);
  //   });
  //   setBeaconOptions(formattedBeaconOptions);
  // }, [beaconOptions]);
  // on change client or setting, return NodeSpecIds, Node Settings, and storage location
  // NodeSpecs are only req'd in parent component until Node Settings

  const onChangeEc = useCallback((newEc: any) => {
    console.log('new selected execution client: ', newEc);
    setSelectedExecutionClient(newEc);
  }, []);
  const onChangeCc = useCallback((newCc: any) => {
    console.log('new selected consensus client: ', newCc);
    setSelectedConsensusClient(newCc);
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange({
        executionClient: sSelectedExecutionClient,
        consensusClient: sSelectedConsensusClient,
      });
    }
  }, [sSelectedExecutionClient, sSelectedConsensusClient, onChange]);

  return (
    <div className={container}>
      <div className={titleFont}>{t('EthereumNode')}</div>
      <div className={descriptionFont}>
        <>{t('AddEthereumNodeDescription')}</>
      </div>
      <ExternalLink
        text={t('LearnMoreClientDiversity')}
        url="https://ethereum.org/en/developers/docs/nodes-and-clients/client-diversity/"
      />
      <p className={sectionFont}>Execution client</p>
      <SpecialSelect onChange={onChangeEc} options={ecOptions} />
      <p className={sectionFont}>Consensus client</p>
      <SpecialSelect onChange={onChangeCc} options={ccOptions} />
      <p className={sectionFont}>Data location</p>
      <DropdownLink
        text={`${sIsOptionsOpen ? 'Hide' : 'Show'} advanced options`}
        onClick={() => setIsOptionsOpen(!sIsOptionsOpen)}
        isDown={!sIsOptionsOpen}
      />
      {sIsOptionsOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <span style={{ fontWeight: 600 }}>Network</span>{' '}
          <div
            style={{ width: 300, display: 'inline-block', marginLeft: 'auto' }}
          >
            <Select onChange={console.log} />
          </div>
        </div>
      )}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '0px',
          gap: 20,
          width: '100%',
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Input disabled placeholder="files/" />
        </div>
        <Button
          size="small"
          label="Change..."
          onClick={() => electron.openDialogForNodeDataDir('')}
        />
      </div>
    </div>
  );
};

export default AddEthereumNode;
