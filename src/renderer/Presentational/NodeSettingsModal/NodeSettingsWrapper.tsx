import { useCallback, useEffect, useState } from 'react';
import { NodeId } from '../../../common/node';
import {
  ConfigTranslation,
  ConfigTranslationMap,
  ConfigValue,
  FilePathControlType,
} from '../../../common/nodeConfig';
import electron from '../../electronGlobal';
import { CategoryConfig } from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';
import RemoveNodeWrapper, {
  RemoveNodeAction,
} from '../RemoveNodeModal/RemoveNodeWrapper';
import NodeSettings from './NodeSettingsModal';

export type SettingChangeHandler = (
  configKey: string,
  newValue: ConfigValue
) => void;
export interface NodeSettingsWrapperProps {
  isOpen: boolean;
  onClickClose: () => void;
}

const HTTP_CORS_DOMAINS_KEY = 'httpCorsDomains';

const NodeSettingsWrapper = ({
  isOpen,
  onClickClose,
}: NodeSettingsWrapperProps) => {
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sConfigTranslationMap, setConfigTranslationMap] =
    useState<ConfigTranslationMap>();
  const [sCategoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>();
  const [sIsRemoveNodeModalOpen, setIsRemoveNodeModalOpen] =
    useState<boolean>(false);
  const [sIsWalletSettingsEnabled, setIsWalletSettingsEnabled] =
    useState<boolean>(false);
  // find httpCors config translation for the wallet settings tab
  const [sHttpCorsConfigTranslation, setHttpCorsConfigTranslation] =
    useState<ConfigTranslation>();
  const [sNodeStartCommand, setNodeStartCommand] = useState<string>();

  const selectedNode = useAppSelector(selectSelectedNode);

  useEffect(() => {
    let isDisabled = true;
    let configTranslationMap;
    let isWalletSettingsEnabled = false;
    console.log(selectedNode);
    if (selectedNode) {
      isDisabled = ['running', 'starting'].includes(selectedNode.status);
      configTranslationMap = selectedNode.spec.configTranslation;
      isWalletSettingsEnabled =
        selectedNode.spec.category === 'L1/ExecutionClient';
    }
    setIsConfigDisabled(isDisabled);
    setConfigTranslationMap(configTranslationMap);
    setIsWalletSettingsEnabled(isWalletSettingsEnabled);
  }, [selectedNode]);
  // configTranslationMap = selectedNode.spec.configTranslation;

  useEffect(() => {
    const fetchData = async (nodeId: NodeId) => {
      const nodeStartCommand = await electron.getNodeStartCommand(nodeId);
      console.log('node start command: ', nodeStartCommand);
      setNodeStartCommand(nodeStartCommand);
    };
    if (selectedNode) {
      fetchData(selectedNode.id);
    }
  }, [selectedNode]);

  useEffect(() => {
    // category to configs
    const categoryMap: Record<string, ConfigTranslationMap> = {};
    // also, find httpCors config translation for the wallet settings tab
    let httpCorsConfigTranslation;
    if (sConfigTranslationMap) {
      Object.keys(sConfigTranslationMap).forEach((configKey) => {
        const configTranslation: ConfigTranslation =
          sConfigTranslationMap[configKey];

        if (configKey === HTTP_CORS_DOMAINS_KEY) {
          httpCorsConfigTranslation = configTranslation;
        }
        const category = configTranslation.category ?? 'Other';
        if (!categoryMap[category]) {
          categoryMap[category] = {};
        }
        categoryMap[category][configKey] = configTranslation;
      });
    }
    setHttpCorsConfigTranslation(httpCorsConfigTranslation);
    const arr = Object.keys(categoryMap).map((category) => {
      return {
        category,
        configTranslationMap: categoryMap[category],
      };
    });

    // Put 'Other' category at the bottom
    arr.sort((x, y) => {
      if (x.category === 'Other') {
        return 1;
      }
      if (y.category === 'Other') {
        return -1;
      }
      return 0;
    });

    setCategoryConfigs(arr);
  }, [sConfigTranslationMap]);

  /**
   * Sent from the individual setting input component
   * @param configKey
   * @param newValue
   */
  const onNodeConfigChange: SettingChangeHandler = async (
    configKey: string,
    newValue: ConfigValue
  ) => {
    // updateNode
    console.log('updating node with newValue: ', newValue);
    if (selectedNode?.config) {
      // If the configChange is for a folder location, open electron
      const { configValuesMap } = selectedNode.config;
      const currentValue = configValuesMap[configKey];
      const { configTranslation } = selectedNode.spec;
      if (
        configTranslation &&
        configTranslation[configKey]?.uiControl.type === FilePathControlType
      ) {
        const openDialogForNodeDataDir =
          await electron.openDialogForNodeDataDir(selectedNode.id);
        console.log(
          'openDialogForNodeDataDir before, and res:',
          currentValue,
          openDialogForNodeDataDir
        );
      } else {
        const newConfig = {
          ...selectedNode.config,
          configValuesMap: {
            ...configValuesMap,
            [configKey]: newValue,
          },
        };
        console.log('updating node with newConfig: ', newConfig);
        await electron.updateNode(selectedNode.id, {
          config: newConfig,
        });
      }
      // todo: show the user it was successful or not
    } else {
      console.error('No selectedNode detected. Unable to change settings');
    }
  };

  const onClickRemoveNode = useCallback(() => {
    setIsRemoveNodeModalOpen(true);
  }, []);

  const onCloseRemoveNode = useCallback(
    (action: RemoveNodeAction) => {
      // if node was removed, close the node settings
      //  select another node?
      // if remove node was "cancel"'d, keep settings open
      console.log('NodeSettingsWrapper: onCloseRemoveNode');
      setIsRemoveNodeModalOpen(false);
      if (action === 'remove') {
        onClickClose();
      }
    },
    [onClickClose]
  );

  return (
    <>
      <NodeSettings
        isOpen={isOpen}
        onClickClose={onClickClose}
        categoryConfigs={sCategoryConfigs}
        configValuesMap={selectedNode?.config.configValuesMap}
        httpCorsConfigTranslation={sHttpCorsConfigTranslation}
        isWalletSettingsEnabled={sIsWalletSettingsEnabled}
        isDisabled={sIsConfigDisabled}
        onChange={onNodeConfigChange}
        onClickRemoveNode={onClickRemoveNode}
        nodeStartCommand={sNodeStartCommand}
      />
      <RemoveNodeWrapper
        isOpen={sIsRemoveNodeModalOpen}
        onClose={onCloseRemoveNode}
      />
    </>
  );
};

export default NodeSettingsWrapper;
