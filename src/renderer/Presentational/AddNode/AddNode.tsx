import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
  descriptionContainer,
} from './addNode.css';
import SpecialSelect, {
  SelectOption,
} from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { setModalState } from '../../state/modal';

// Other node types are not ready yet
const nodeOptions = [
  {
    iconId: 'base',
    title: 'Base',
    value: 'base',
    label: 'Base',
    info: 'A secure and low-cost Ethereum Layer 2 built on the OP stack',
  },
  {
    iconId: 'ethereum',
    title: 'Ethereum',
    value: 'ethereum',
    label: 'Ethereum',
    info: 'The world computer',
  },

  // {
  //   iconId: 'optimism',
  //   title: 'Optimism',
  //   value: 'optimism',
  //   label: 'Optimism',
  //   info: 'Built by the OP Collective!',
  // },
  {
    iconId: 'farcaster',
    title: 'Farcaster',
    value: 'farcaster',
    label: 'Farcaster',
    info: 'A protocol for decentralized social apps',
  },
  {
    iconId: 'arbitrum',
    title: 'Arbitrum One',
    value: 'arbitrum',
    label: 'Arbitrum One',
    info: 'Welcome to the future of Ethereum',
  },
];

let alphaModalRendered = false;

export type AddNodeValues = {
  node?: SelectOption;
};
export interface AddNodeProps {
  /**
   * Listen to node config changes
   */
  onChange?: (newValue: AddNodeValues) => void;
  nodeConfig?: AddNodeValues;
  setNode?: (nodeSelection: SelectOption, object: AddNodeValues) => void;
  shouldHideTitle?: boolean;
}

const AddNode = ({
  nodeConfig,
  setNode,
  onChange,
  shouldHideTitle,
}: AddNodeProps) => {
  const { t } = useTranslation();
  const [sSelectedNode, setSelectedNode] = useState<SelectOption>(
    nodeConfig?.node || nodeOptions[0],
  );
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const hasSeenAlpha = await electron.getSetHasSeenAlphaModal();
      setHasSeenAlphaModal(hasSeenAlpha || false);

      // Modal Parent needs updated with the default initial value
      // Todo: due to a JS closure bug with modalOnChangeConfig, we are setting the selected node here
      const ethNodeConfig = {
        node: sSelectedNode,
      };
      if (setNode) {
        setNode(sSelectedNode, ethNodeConfig);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeNode = useCallback(
    (newNode?: SelectOption) => {
      console.log('onChange node selected: ', newNode);
      // clear any client selections when the node changes
      const nodeConfig = {
        node: sSelectedNode,
      };
      if (newNode) {
        setSelectedNode(newNode);
        if (setNode) setNode(newNode, nodeConfig);
      }
    },
    [sSelectedNode, setNode],
  );

  useEffect(() => {
    if (onChange) {
      console.log(
        'AddNode.tsx: useEffect[onChange, sSelectedNode]: sSelectedNode is ',
        sSelectedNode,
      );
      onChange({
        node: sSelectedNode,
      });
    }
  }, [sSelectedNode, onChange]);

  if (sHasSeenAlphaModal === false && !alphaModalRendered) {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: { route: 'alphaBuild', type: 'info' },
      }),
    );
    alphaModalRendered = true;
  }
  console.log('sSelectedNode is ', sSelectedNode);

  return (
    <div className={container}>
      {shouldHideTitle !== true && (
        <div className={titleFont}>{t('AddYourFirstNode')}</div>
      )}
      <div className={descriptionContainer}>
        <div className={descriptionFont}>
          <>{t('AddNodeDescription')}</>
        </div>
      </div>
      <p className={sectionFont}>Network</p>
      <SpecialSelect
        selectedOption={sSelectedNode}
        onChange={onChangeNode}
        options={nodeOptions}
      />
    </div>
  );
};

export default AddNode;
