import { useEffect, useState } from 'react';

import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
import {
  UIConfigTranslation,
  EthNodeUIConfigTranslation,
  ConfigTranslationControl,
} from '../../common/nodeConfig';

const DynamicNodeConfig = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>();
  const [sUiConfig, setUiConfig] = useState<UIConfigTranslation>();

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

  return (
    <>
      <h2>Node</h2>
      {sIsConfigDisabled && (
        <h5>The node must be stopped to make configuration changes.</h5>
      )}
      {sUiConfig?.translation ? (
        <>
          {Object.keys(sUiConfig.translation).map((key) => {
            const aUiConfig: ConfigTranslationControl =
              sUiConfig.translation[key];

            return (
              <div key={key}>
                <p>{aUiConfig.displayName}</p>
                {aUiConfig.type === 'filePath' && <p>Insert file path</p>}
              </div>
            );
          })}
        </>
      ) : (
        <p>Unable to find configuration settings</p>
      )}
    </>
  );
};
export default DynamicNodeConfig;
