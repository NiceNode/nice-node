import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import SelectCard from '../../Generics/redesign/SelectCard/SelectCard';
import type { SelectOption } from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import type { NodeIcons } from '../../assets/images/nodeIcons';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { setModalState } from '../../state/modal';
import {
  container,
  descriptionContainer,
  descriptionFont,
  sectionFont,
  titleFont,
} from './addNode.css';

// Other node types are not ready yet
// todo: dynamic node options
const nodeOptions = [
  {
    iconId: 'ethereum',
    title: 'Ethereum',
    value: 'ethereum',
    label: 'Ethereum',
    info: 'The world computer',
  },
  {
    iconId: 'base',
    title: 'Base',
    value: 'base',
    label: 'Base',
    info: 'A secure and low-cost Ethereum Layer 2 built on the OP stack',
  },
  {
    iconId: 'optimism',
    title: 'Optimism',
    value: 'optimism',
    label: 'Optimism',
    info: 'Ethereum, scaled. Built by the OP Collective',
  },
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

// todo: dynamic node options
const otherNodeOptions = [
  {
    iconId: 'home-assistant',
    title: 'Home Assistant',
    value: 'home-assistant',
    label: 'Home Assistant',
    info: 'Awaken your home',
  },
  {
    iconId: 'minecraft',
    title: 'Minecraft Server',
    value: 'minecraft',
    label: 'Minecraft Server',
    info: 'The world is yours for the making',
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
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();

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

  return (
    <div className={container}>
      {shouldHideTitle !== true && (
        <div id="addFirstNodeTitle" className={titleFont}>
          {t('AddYourFirstNode')}
        </div>
      )}
      <div className={descriptionContainer}>
        <div className={descriptionFont}>{t('AddNodeDescription')}</div>
      </div>
      <p className={sectionFont}>{t('Network')}</p>
      <div style={{ width: '100%' }}>
        {nodeOptions.map((nodeOption) => {
          return (
            <SelectCard
              key={nodeOption.value}
              title={nodeOption.title}
              // iconUrl={nodeOption.iconUrl}
              iconId={nodeOption.iconId as keyof NodeIcons}
              info={nodeOption.info}
              onClick={() => onChangeNode(nodeOption)}
              isSelected={sSelectedNode?.value === nodeOption.value}
            />
          );
        })}
      </div>

      {/* Other options are default hidden by a dropdown */}
      {/* Todo: this should be named "Show more options" */}
      <DropdownLink
        text={`${
          isOptionsOpen ? t('HideAdvancedOptions') : t('ShowAdvancedOptions')
        }`}
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        isDown={!isOptionsOpen}
      />
      {isOptionsOpen && (
        <>
          <p className={sectionFont}>{t('Other')}</p>
          <div style={{ width: '100%' }}>
            {otherNodeOptions.map((nodeOption) => {
              return (
                <SelectCard
                  key={nodeOption.value}
                  title={nodeOption.title}
                  // iconUrl={nodeOption.iconUrl}
                  iconId={nodeOption.iconId as keyof NodeIcons}
                  info={nodeOption.info}
                  onClick={() => onChangeNode(nodeOption)}
                  isSelected={sSelectedNode?.value === nodeOption.value}
                />
              );
            })}
          </div>
        </>
      )}

      {/* <SpecialSelect
        selectedOption={sSelectedNode}
        onChange={onChangeNode}
        options={nodeOptions}
      /> */}
    </div>
  );
};

export default memo(AddNode);
