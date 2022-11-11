import { useEffect, useState } from 'react';

import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
import {
  ConfigValue,
  ConfigTranslationMap,
  ConfigTranslation,
  ConfigTranslationControl,
} from '../../common/nodeConfig';
import electron from '../electronGlobal';
import Select from '../DynamicControls/Select';
import TextArea from '../DynamicControls/TextArea';
import Warning from '../Warning';
import { InfoModal } from '../InfoIconButton';
import ExternalLink from '../Generics/ExternalLink';

type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
const DynamicNodeConfig = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sConfigTranslationMap, setConfigTranslationMap] =
    useState<ConfigTranslationMap>();
  const [sCategoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>();

  useEffect(() => {
    let isDisabled = true;
    let configTranslationMap;
    console.log(selectedNode);
    if (selectedNode) {
      isDisabled = selectedNode.status === 'running';
      configTranslationMap = selectedNode.spec.configTranslation;
    }
    console.log('NodeConfig isDisabled? ', isDisabled);
    setIsConfigDisabled(isDisabled);
    console.log(
      'DynamicSettings configValuesMap',
      selectedNode?.config.configValuesMap
    );
    console.log('DynamicSettings configTranslationMap', configTranslationMap);
    setConfigTranslationMap(configTranslationMap);
  }, [selectedNode]);

  useEffect(() => {
    // category to configs
    const categoryMap: Record<string, ConfigTranslationMap> = {};
    if (sConfigTranslationMap) {
      Object.keys(sConfigTranslationMap).forEach((configKey) => {
        const configTranslation: ConfigTranslation =
          sConfigTranslationMap[configKey];
        const category = configTranslation.category ?? 'Other';
        if (!categoryMap[category]) {
          categoryMap[category] = {};
        }
        categoryMap[category][configKey] = configTranslation;
      });
    }
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

  if (!selectedNode) {
    return <>No node selected</>;
  }

  const onNodeConfigChange = async (
    configKey: string,
    newValue: ConfigValue
  ) => {
    // updateNode
    console.log('updating node with newValue: ', newValue);
    const { configValuesMap } = selectedNode.config;
    const newConfig = {
      ...selectedNode.config,
      configValuesMap: {
        ...configValuesMap,
        [configKey]: newValue,
      },
    };
    // console.log('updating node with newConfig: ', newConfig);
    await electron.updateNode(selectedNode.id, {
      config: newConfig,
    });
    // console.log('updated node!!!: ', updateNode);
    // todo: show user a success notification
  };

  return (
    <>
      {sIsConfigDisabled && (
        <Warning>
          <h3>The node must be stopped to make configuration changes.</h3>
        </Warning>
      )}
      {sCategoryConfigs && (
        <>
          {sCategoryConfigs.map((categoryConfig) => {
            const { configTranslationMap, category } = categoryConfig;
            return (
              <div key={category}>
                <h2 style={{ marginBlockEnd: 0 }}>{category}</h2>
                {configTranslationMap ? (
                  <>
                    {Object.keys(configTranslationMap).map((configKey) => {
                      const configTranslation: ConfigTranslation =
                        configTranslationMap[configKey];

                      const configTranslationControl: ConfigTranslationControl =
                        configTranslation.uiControl;
                      let currentValue: string | string[] =
                        selectedNode.config?.configValuesMap?.[configKey];
                      if (currentValue === undefined) {
                        if (
                          configTranslation.niceNodeDefaultValue !== undefined
                        ) {
                          currentValue = configTranslation.niceNodeDefaultValue;
                        } else if (
                          configTranslation.defaultValue !== undefined
                        ) {
                          currentValue = configTranslation.defaultValue;
                        }
                        // todo for mutli select?
                      }
                      // console.log(
                      //   'rendering config: ',
                      //   configTranslation,
                      //   currentValue
                      // );
                      return (
                        <div key={configKey} style={{ marginBottom: 20 }}>
                          <div>
                            <span>{configTranslation.displayName}</span>
                            {(configTranslation.infoDescription ||
                              configTranslation.documentation) && (
                              <InfoModal title={configTranslation.displayName}>
                                {configTranslation.infoDescription}
                                {configTranslation.defaultValue && (
                                  <p>
                                    Default value:{' '}
                                    {configTranslation.defaultValue}
                                  </p>
                                )}
                                {configTranslation.documentation && (
                                  <ExternalLink
                                    title="Documentation Link"
                                    url={configTranslation.documentation}
                                  />
                                )}
                              </InfoModal>
                            )}
                          </div>
                          {configTranslationControl?.type === 'filePath' && (
                            <>
                              {`Current folder: ${currentValue}`}
                              <button
                                type="button"
                                onClick={() =>
                                  electron.openDialogForNodeDataDir(
                                    selectedNode.id
                                  )
                                }
                                disabled={sIsConfigDisabled}
                              >
                                Select folder
                              </button>
                            </>
                          )}
                          {configTranslationControl?.type === 'text' && (
                            <TextArea
                              value={currentValue as string}
                              onChange={(newValue: string) =>
                                onNodeConfigChange(configKey, newValue)
                              }
                              isDisabled={sIsConfigDisabled}
                            />
                          )}
                          {(configTranslationControl?.type ===
                            'select/single' ||
                            configTranslationControl?.type ===
                              'select/multiple') && (
                            <Select
                              value={currentValue}
                              // defaultValue={configTranslation.defaultValue}
                              onChange={(newValue) =>
                                onNodeConfigChange(configKey, newValue)
                              }
                              options={configTranslationControl.controlTranslations.map(
                                ({ value }) => {
                                  return { value, label: value };
                                }
                              )}
                              isDisabled={sIsConfigDisabled}
                              isMulti={
                                configTranslationControl?.type ===
                                'select/multiple'
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p>Unable to find configuration settings</p>
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};
export default DynamicNodeConfig;
