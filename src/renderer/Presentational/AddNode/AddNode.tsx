import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { NodePackageLibrary } from '../../../main/state/nodeLibrary.js';
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
  nodePackageLibrary?: NodePackageLibrary;
}

const AddNode = ({
  nodeConfig,
  setNode,
  onChange,
  shouldHideTitle,
  nodePackageLibrary,
}: AddNodeProps) => {
  const { t } = useTranslation();
  const [sSelectedNode, setSelectedNode] = useState<SelectOption>(
    // todo: and test splash screen
    nodeConfig?.node,
  );
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!sSelectedNode && nodePackageLibrary?.ethereum) {
      console.log(
        'sSelectedNode is null, setting it to nodePackageLibrary?.ethereum',
        nodePackageLibrary?.ethereum,
      );
      const defaultNodePackage = nodePackageLibrary.ethereum;
      setSelectedNode(defaultNodePackage);

      // Modal Parent needs updated with the default initial value
      // Todo: due to a JS closure bug with modalOnChangeConfig, we are setting the selected node here
      const ethNodeConfig = {
        node: defaultNodePackage,
      };
      if (setNode) {
        setNode(defaultNodePackage, ethNodeConfig);
      }
    }
  }, [nodePackageLibrary]);

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
        {nodePackageLibrary &&
          Object.keys(nodePackageLibrary).map((nodePackageId) => {
            const nodeOption = nodePackageLibrary[nodePackageId];
            if (
              nodeOption?.category.includes('utility') ||
              nodeOption?.category.includes('gaming')
            ) {
              return null;
            }

            return (
              <SelectCard
                key={nodeOption.specId}
                title={nodeOption.displayName}
                iconUrl={nodeOption.iconUrl}
                iconId={nodeOption.specId as keyof NodeIcons}
                info={
                  nodeOption.selectCardTagline
                    ? nodeOption.selectCardTagline
                    : nodeOption.displayTagline
                }
                onClick={() => onChangeNode(nodeOption)}
                isSelected={sSelectedNode?.specId === nodeOption.specId}
              />
            );
          })}
      </div>

      {/* Other options are default hidden by a dropdown */}
      {/* Todo: this should be named "Show more options" */}
      <DropdownLink
        text={`${
          isOptionsOpen ? t('HideOtherNodeTypes') : t('ShowOtherNodeTypes')
        }`}
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        isDown={!isOptionsOpen}
      />
      {isOptionsOpen && (
        <div style={{ width: '100%' }}>
          {nodePackageLibrary &&
            Object.keys(nodePackageLibrary).map((nodePackageId) => {
              const nodeOption = nodePackageLibrary[nodePackageId];
              if (
                nodeOption?.category.includes('utility') ||
                nodeOption?.category.includes('gaming')
              ) {
                return (
                  <SelectCard
                    key={nodeOption.specId}
                    title={nodeOption.displayName}
                    iconUrl={nodeOption.iconUrl}
                    iconId={nodeOption.specId as keyof NodeIcons}
                    info={
                      nodeOption.selectCardTagline
                        ? nodeOption.selectCardTagline
                        : nodeOption.displayTagline
                    }
                    onClick={() => onChangeNode(nodeOption)}
                    isSelected={sSelectedNode?.specId === nodeOption.specId}
                  />
                );
              }
            })}
        </div>
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
