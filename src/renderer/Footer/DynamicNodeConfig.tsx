import { useEffect, useState } from 'react';

import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
import {
  UIConfigTranslation,
  EthNodeUIConfigTranslation,
  ConfigTranslationControl,
} from '../../common/nodeConfig';
import electron from '../electronGlobal';
import Select from '../DynamicControls/Select';

const DynamicNodeConfig = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sUiConfig, setUiConfig] = useState<UIConfigTranslation>();

  const [sText, setText] = useState<string>();

  useEffect(() => {
    let isDisabled = true;
    let uiConfig;
    if (selectedNode) {
      isDisabled = selectedNode.status === 'running';
      if (selectedNode.spec.configTranslation?.type === 'EthNode') {
        uiConfig = EthNodeUIConfigTranslation;
      } else {
        // todo: parse UiConfig translation from the spec?
      }
    }
    setIsConfigDisabled(isDisabled);
    setUiConfig(uiConfig);
  }, [selectedNode]);

  if (!selectedNode) {
    return <>No node selected</>;
  }

  const onChange = (text: string) => {
    // updateNode
    setText(text);
  };

  const onNodeConfigChange = async (configKey: string, newValue: any) => {
    // updateNode
    const { nodeConfigTranslationValues } = selectedNode.config;
    nodeConfigTranslationValues[configKey] = newValue;
    const updateNode = await electron.updateNode(selectedNode.id, {
      config: {
        nodeConfigTranslationValues,
      },
    });
    console.log('updated node!!!: ', updateNode);
  };

  return (
    <>
      {selectedNode && (
        <>
          <h2>Node</h2>
          {sIsConfigDisabled && (
            <h5>The node must be stopped to make configuration changes.</h5>
          )}
          {sUiConfig?.translation ? (
            <>
              {Object.keys(sUiConfig.translation).map((configKey) => {
                const aUiConfig: ConfigTranslationControl =
                  sUiConfig.translation[configKey];
                const currentValue =
                  selectedNode.config?.nodeConfigTranslationValues[configKey];
                return (
                  <div key={configKey}>
                    <p>{aUiConfig.displayName}</p>
                    {aUiConfig.type === 'filePath' && (
                      <>
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
                    {aUiConfig.type === 'text' && (
                      <>
                        <textarea
                          style={{
                            minWidth: 400,
                            minHeight: 30,
                          }}
                          value={sText}
                          onChange={(e) => onChange(e.target.value)}
                          disabled={sIsConfigDisabled}
                        />
                      </>
                    )}
                    {aUiConfig.type === 'select' && (
                      <Select
                        value={currentValue}
                        onChange={(newValue) =>
                          onNodeConfigChange(configKey, newValue)
                        }
                        options={aUiConfig.options}
                        isDisabled={sIsConfigDisabled}
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
