import { useEffect, useState } from 'react';
import { ModalConfig } from '../ModalManager/modalUtils';
import { setModalState } from '../../state/modal';
import Node, { NodeId } from '../../../common/node';
import {
  ConfigTranslation,
  ConfigTranslationMap,
  ConfigValue,
  FilePathControlType,
} from '../../../common/nodeConfig';
import electron from '../../electronGlobal';
import { CategoryConfig } from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';
import NodeSettings from './NodeSettings';

export type SettingChangeHandler = (
  configKey: string,
  newValue: ConfigValue,
) => void;
export interface NodeSettingsWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: true) => void;
  disableSaveButton: (value: boolean) => void;
}

const HTTP_CORS_DOMAINS_KEY = 'httpCorsDomains';

const NodeSettingsWrapper = ({
  modalOnChangeConfig,
  disableSaveButton,
}: NodeSettingsWrapperProps) => {
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sConfigTranslationMap, setConfigTranslationMap] =
    useState<ConfigTranslationMap>();
  const [sCategoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>();
  const [sIsWalletSettingsEnabled, setIsWalletSettingsEnabled] =
    useState<boolean>(false);
  // find httpCors config translation for the wallet settings tab
  const [sHttpCorsConfigTranslation, setHttpCorsConfigTranslation] =
    useState<ConfigTranslation>();
  const [sNodeStartCommand, setNodeStartCommand] = useState<string>();
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(
    sSelectedNode,
  );
  const [initialized, setInitialized] = useState(false);

  const dispatch = useAppDispatch();

  const getUpdatedConfigValuesMap = () => {
    if (selectedNode?.config && sConfigTranslationMap) {
      const { configValuesMap } = selectedNode.config;
      const keysToIgnore = [
        'dataDir',
        'http' /* add any other keys to ignore here */,
      ];

      const newConfigValuesMap: {
        [key: string]: string | string[] | undefined;
      } = { ...configValuesMap };

      Object.keys(sConfigTranslationMap)
        .filter(
          (key) => !keysToIgnore.includes(key) && !(key in newConfigValuesMap),
        )
        .forEach((key) => {
          newConfigValuesMap[key] =
            sConfigTranslationMap[key]?.defaultValue || '';
        });
      return newConfigValuesMap;
    }
    return null;
  };

  const updatedConfig = getUpdatedConfigValuesMap();

  useEffect(() => {
    if (selectedNode?.config && sConfigTranslationMap && !initialized) {
      const { configValuesMap } = selectedNode.config;

      // check if there are any new keys in configTranslations compared to config values
      if (
        Object.keys(configValuesMap).length ===
        Object.keys(sConfigTranslationMap).length
      ) {
        setInitialized(true);
        return;
      }

      const newConfig = {
        ...selectedNode.config,
        configValuesMap: updatedConfig,
      };

      modalOnChangeConfig({ settingsConfig: newConfig, selectedNode });
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sCategoryConfigs, sConfigTranslationMap, selectedNode, initialized]);

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
    if (isDisabled) {
      disableSaveButton(true);
    }
    setIsConfigDisabled(isDisabled);
    setConfigTranslationMap(configTranslationMap);
    setIsWalletSettingsEnabled(isWalletSettingsEnabled);
  }, [disableSaveButton, selectedNode]);
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
    newValue: ConfigValue,
  ) => {
    // updateNode
    console.log('updating node with newValue: ', newValue);
    if (selectedNode?.config && updatedConfig) {
      // If the configChange is for a folder location, open electron
      const currentValue = updatedConfig[configKey];
      const { configTranslation } = selectedNode.spec;
      if (
        configTranslation &&
        configTranslation[configKey]?.uiControl.type === FilePathControlType
      ) {
        const newDataDir = await electron.openDialogForNodeDataDir(
          selectedNode.id,
        );
        console.log(
          'openDialogForNodeDataDir before, and res:',
          currentValue,
          newDataDir,
        );

        const newRuntime = {
          ...selectedNode.runtime,
          dataDir: newDataDir,
        };

        const newConfig = {
          ...selectedNode.config,
          configValuesMap: {
            ...updatedConfig,
            dataDir: newDataDir,
          },
        };

        const newNode = {
          ...selectedNode,
          config: newConfig,
          runtime: newRuntime,
        };

        setSelectedNode(newNode);
        modalOnChangeConfig({ newDataDir, selectedNode });
      } else {
        const newConfig = {
          ...selectedNode.config,
          configValuesMap: {
            ...updatedConfig,
            [configKey]: newValue,
          },
        };
        console.log('updating node with newConfig: ', newConfig);
        const newNode = {
          ...selectedNode,
          config: newConfig,
        };
        setSelectedNode(newNode as Node);
        modalOnChangeConfig({
          settingsConfig: newConfig,
          selectedNode,
        });
      }
      // todo: show the user it was successful or not
    } else {
      console.error('No selectedNode detected. Unable to change settings');
    }
  };

  return (
    <NodeSettings
      categoryConfigs={sCategoryConfigs}
      configValuesMap={selectedNode?.config.configValuesMap}
      httpCorsConfigTranslation={sHttpCorsConfigTranslation}
      isWalletSettingsEnabled={sIsWalletSettingsEnabled}
      isDisabled={sIsConfigDisabled}
      onChange={onNodeConfigChange}
      onClickRemoveNode={() => {
        dispatch(
          setModalState({
            isModalOpen: true,
            screen: { route: 'removeNode', type: 'alert' },
          }),
        );
      }}
      nodeStartCommand={sNodeStartCommand}
    />
  );
};

export default NodeSettingsWrapper;
