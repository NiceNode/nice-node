import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NodeLibrary } from 'main/state/nodeLibrary';
import { ModalConfig } from '../ModalManager/modalUtils';
import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
  descriptionContainer,
} from './addBaseNode.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import SpecialSelect, {
  SelectOption,
} from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
// import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
// import Select from '../../Generics/redesign/Select/Select';
// import { NodeSpecification } from '../../../common/nodeSpec';
import FolderInput from '../../Generics/redesign/Input/FolderInput';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { captionText } from '../PodmanInstallation/podmanInstallation.css';

const ecOptions = [
  {
    iconId: 'op-geth',
    value: 'op-geth',
    label: 'OP Geth',
    title: 'OP Geth',
    info: 'Execution Client',
  },
];

const ccOptions = [
  {
    iconId: 'op-node',
    value: 'op-node',
    label: 'OP Node',
    title: 'OP Node',
    info: 'Consensus Client',
  },
];

export type AddBaseNodeValues = {
  executionClient?: SelectOption;
  consensusClient?: SelectOption;
  storageLocation?: string;
};
export interface AddBaseNodeProps {
  // executionOptions: NodeSpecification[];
  // beaconOptions: NodeSpecification[];
  /**
   * Listen to node config changes
   */
  onChange?: (newValue: AddBaseNodeValues) => void;
  ethereumNodeConfig?: AddBaseNodeValues;
  setConsensusClient?: (
    elClient: SelectOption,
    object: AddBaseNodeValues,
  ) => void;
  setExecutionClient?: (
    clClient: SelectOption,
    object: AddBaseNodeValues,
  ) => void;
  modalOnChangeConfig?: (config: ModalConfig) => void;
}

const AddBaseNode = ({
  ethereumNodeConfig,
  setConsensusClient,
  setExecutionClient,
  modalOnChangeConfig,
  onChange,
}: /**
 * Todo: Pass options from the node spec files
 */
// executionOptions,
// beaconOptions,
AddBaseNodeProps) => {
  const { t } = useTranslation();
  const { t: tGeneric } = useTranslation('genericComponents');
  // const [sIsOptionsOpen, setIsOptionsOpen] = useState<boolean>();
  const [sSelectedExecutionClient, setSelectedExecutionClient] =
    useState<SelectOption>(ethereumNodeConfig?.executionClient || ecOptions[0]);
  const [sSelectedConsensusClient, setSelectedConsensusClient] =
    useState<SelectOption>(ethereumNodeConfig?.consensusClient || ccOptions[0]);
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>(
    ethereumNodeConfig?.storageLocation || '',
  );
  const [
    sNodeStorageLocationFreeStorageGBs,
    setNodeStorageLocationFreeStorageGBs,
  ] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const defaultNodesStorageDetails =
        await electron.getNodesDefaultStorageLocation();
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      console.log('defaultNodesStorageDetails', defaultNodesStorageDetails);
      setNodeStorageLocation(defaultNodesStorageDetails.folderPath);
      if (modalOnChangeConfig) {
        modalOnChangeConfig({
          storageLocation: defaultNodesStorageDetails.folderPath,
          nodeLibrary,
        });
      }
      setNodeStorageLocationFreeStorageGBs(
        defaultNodesStorageDetails.freeStorageGBs,
      );
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeEc = useCallback(
    (newEc?: SelectOption) => {
      console.log('new selected execution client: ', newEc);
      const ethNodeConfig = {
        executionClient: sSelectedExecutionClient,
        consensusClient: sSelectedConsensusClient,
        storageLocation: sNodeStorageLocation,
      };
      if (newEc) {
        setSelectedExecutionClient(newEc);
        if (setExecutionClient) setExecutionClient(newEc, ethNodeConfig);
      }
    },
    [
      sSelectedExecutionClient,
      sSelectedConsensusClient,
      sNodeStorageLocation,
      setExecutionClient,
    ],
  );

  const onChangeCc = useCallback(
    (newCc?: SelectOption) => {
      console.log('new selected consensus client: ', newCc);
      const ethNodeConfig = {
        executionClient: sSelectedExecutionClient,
        consensusClient: sSelectedConsensusClient,
        storageLocation: sNodeStorageLocation,
      };
      if (newCc) {
        setSelectedConsensusClient(newCc);
        if (setConsensusClient) setConsensusClient(newCc, ethNodeConfig);
      }
    },
    [
      sSelectedExecutionClient,
      sSelectedConsensusClient,
      sNodeStorageLocation,
      setConsensusClient,
    ],
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        executionClient: sSelectedExecutionClient,
        consensusClient: sSelectedConsensusClient,
        storageLocation: sNodeStorageLocation,
      });
    }
  }, [
    sSelectedExecutionClient,
    sSelectedConsensusClient,
    sNodeStorageLocation,
    onChange,
  ]);

  return (
    <div className={container}>
      {!modalOnChangeConfig && (
        <div className={titleFont}>Launch a Base Node</div>
      )}
      <div className={descriptionContainer}>
        <div className={descriptionFont}>
          <>{t('AddBaseNodeDescription')}</>
        </div>
        <ExternalLink
          text={t('LearnMoreClientDiversity')}
          url="https://ethereum.org/en/developers/docs/nodes-and-clients/client-diversity/"
        />
      </div>
      <p className={sectionFont}>Execution client</p>
      <SpecialSelect
        selectedOption={sSelectedExecutionClient}
        onChange={onChangeEc}
        options={ecOptions}
      />
      <p className={sectionFont}>Consensus client</p>
      <SpecialSelect
        selectedOption={sSelectedConsensusClient}
        onChange={onChangeCc}
        options={ccOptions}
      />
      {/* Todo: add and make work */}
      {/* <DropdownLink
        text={`${
          sIsOptionsOpen
            ? tGeneric('HideAdvancedOptions')
            : tGeneric('ShowAdvancedOptions')
        }`}
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
          <span style={{ fontWeight: 600 }}>{tGeneric('Network')}</span>{' '}
          <div
            style={{
              width: 300,
              display: 'inline-block',
              marginLeft: 'auto',
            }}
          >
            <Select
              onChange={console.log}
              options={[
                { value: 'mainnet', label: 'Ethereum Mainnet' },
                { value: 'goerli', label: 'Goerli Testnet' },
                { value: 'sepolia', label: 'Sepolia Testnet' },
              ]}
            />
          </div>
        </div>
      )} */}
      <HorizontalLine />
      <p className={sectionFont}>{tGeneric('DataLocation')}</p>
      <p
        className={captionText}
      >{`Changing location only supported on Mac and only locations under /Users/<current-user>/ or /Volumes/`}</p>
      <FolderInput
        // disabled
        placeholder={sNodeStorageLocation ?? tGeneric('loadingDotDotDot')}
        freeStorageSpaceGBs={sNodeStorageLocationFreeStorageGBs}
        onClickChange={async () => {
          const storageLocationDetails =
            await electron.openDialogForStorageLocation();
          console.log('storageLocationDetails', storageLocationDetails);
          if (storageLocationDetails) {
            setNodeStorageLocation(storageLocationDetails.folderPath);
            if (modalOnChangeConfig) {
              modalOnChangeConfig({
                storageLocation: storageLocationDetails.folderPath,
              });
            }
            setNodeStorageLocationFreeStorageGBs(
              storageLocationDetails.freeStorageGBs,
            );
          } else {
            // user didn't change the folder path
          }
        }}
      />
    </div>
  );
};

export default AddBaseNode;
