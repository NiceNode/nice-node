import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NodeLibrary, NodePackageLibrary } from 'main/state/nodeLibrary';
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
}: AddBaseNodeProps) => {
  const { t } = useTranslation();
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
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      console.log('defaultNodesStorageDetails', defaultNodesStorageDetails);
      setNodeStorageLocation(defaultNodesStorageDetails.folderPath);
      if (modalOnChangeConfig) {
        modalOnChangeConfig({
          executionClient: sSelectedExecutionClient.value,
          consensusClient: sSelectedConsensusClient.value,
          storageLocation: defaultNodesStorageDetails.folderPath,
          nodeLibrary,
          nodePackageLibrary,
        });
      }
      setNodeStorageLocationFreeStorageGBs(
        defaultNodesStorageDetails.freeStorageGBs,
      );
    };
    fetchData();

    // Modal Parent needs updated with the default initial value
    const ethNodeConfig = {
      executionClient: sSelectedExecutionClient,
      consensusClient: sSelectedConsensusClient,
    };
    if (setExecutionClient) {
      setExecutionClient(sSelectedExecutionClient, ethNodeConfig);
    }
    if (setConsensusClient) {
      setConsensusClient(sSelectedConsensusClient, ethNodeConfig);
    }
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
    console.log(
      'here: ',
      sSelectedExecutionClient,
      sSelectedConsensusClient,
      sNodeStorageLocation,
      onChange,
    );
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
        <div className={titleFont}>
          {t('LaunchAVarNode', { nodeName: 'Base' })}
        </div>
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
      <HorizontalLine />
      <p className={sectionFont}>{t('DataLocation')}</p>
      <p
        className={captionText}
      >{`Changing location only supported on Mac & Linux and only locations under /Users/<current-user>/ or /Volumes/`}</p>
      <FolderInput
        placeholder={sNodeStorageLocation ?? t('loadingDotDotDot')}
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
