import { useEffect, useState } from 'react';

import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
import {
  ConfigKey,
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

const DynamicNodeConfig = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sConfigTranslationMap, setConfigTranslationMap] =
    useState<ConfigTranslationMap>();

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
    setConfigTranslationMap(configTranslationMap);
  }, [selectedNode]);

  if (!selectedNode) {
    return <>No node selected</>;
  }

  const onNodeConfigChange = async (configKey: string, newValue: any) => {
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
    const updateNode = await electron.updateNode(selectedNode.id, {
      config: newConfig,
    });
    // console.log('updated node!!!: ', updateNode);
  };

  return (
    <>
      {selectedNode && (
        <>
          {sIsConfigDisabled && (
            <Warning>
              <h3>The node must be stopped to make configuration changes.</h3>
            </Warning>
          )}
          {sConfigTranslationMap ? (
            <>
              {Object.keys(sConfigTranslationMap).map((configKey) => {
                const configTranslation: ConfigTranslation =
                  sConfigTranslationMap[configKey];

                const configTranslationControl: ConfigTranslationControl =
                  configTranslation.uiControl;
                let currentValue =
                  selectedNode.config?.configValuesMap?.[configKey];
                if (
                  currentValue === undefined &&
                  configTranslation.defaultValue !== undefined
                ) {
                  currentValue = configTranslation.defaultValue;
                }
                console.log(
                  'rendering config: ',
                  configTranslation,
                  currentValue
                );
                return (
                  <div key={configKey}>
                    <div>
                      <span>{configTranslation.displayName}</span>
                      {(configTranslation.infoDescription ||
                        configTranslation.documentation) && (
                        <InfoModal title={configTranslation.displayName}>
                          {configTranslation.infoDescription}
                          {configTranslation.documentation && (
                            <ExternalLink
                              title={'Documentation Link'}
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
                            electron.openDialogForNodeDataDir(selectedNode.id)
                          }
                          disabled={sIsConfigDisabled}
                        >
                          Select folder
                        </button>
                      </>
                    )}
                    {configTranslationControl?.type === 'text' && (
                      <TextArea
                        value={currentValue}
                        onChange={(newValue: string) =>
                          onNodeConfigChange(configKey, newValue)
                        }
                        isDisabled={sIsConfigDisabled}
                      />
                    )}
                    {(configTranslationControl?.type === 'select/single' ||
                      configTranslationControl?.type === 'select/multiple') && (
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
                          configTranslationControl?.type === 'select/multiple'
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
        </>
      )}
    </>
  );
};
export default DynamicNodeConfig;
