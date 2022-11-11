import { useEffect, useState } from 'react';
import {
  ConfigValue,
  ConfigTranslationMap,
  ConfigTranslation,
  ConfigTranslationControl,
  ConfigKey,
} from '../../../../common/nodeConfig';
import FolderInput from '../Input/FolderInput';
import Input from '../Input/Input';
import Select from '../Select/Select';
import MultiSelect from './DynamicControls/Select';
import TextArea from './DynamicControls/TextArea';
// import Warning from '../Warning';
// import { InfoModal } from '../InfoIconButton';
// import ExternalLink from '../Generics/ExternalLink';

type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
// isDisabled? selectedNodeId (for dialog)
export type SettingProps = {
  configTranslation: ConfigTranslation;
  configKey: ConfigKey;
  currentValue: string | string[];
  onChange?: (configKey: string, newValue: ConfigValue) => void;
};
// configTranslationMap = selectedNode.spec.configTranslation;
const Setting = ({
  configTranslation,
  configKey,
  currentValue,
  onChange,
}: SettingProps) => {
  const onNodeConfigChange = async (newValue: ConfigValue) => {
    // updateNode
    console.log('updating node with newValue: ', newValue);
    if (onChange) {
      onChange(configKey, newValue);
    }
  };

  const configTranslationControl: ConfigTranslationControl =
    configTranslation.uiControl;

  // configKey (ex. "http")
  // configTranslation
  // currentValue (Str)
  return (
    <div key={configKey}>
      <div>
        {/* <span>{configTranslation.displayName}</span> */}
        {/* {(configTranslation.infoDescription ||
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
                            )} */}
      </div>
      {configTranslationControl?.type === 'filePath' && (
        <FolderInput
          placeholder={currentValue as string}
          onClickChange={() => {
            console.log('onclick dir');
            // todo: fix
            // electron.openDialogForNodeDataDir('test')}/>
          }}
        />
        // <>
        //   {`Current folder: ${currentValue}`}
        //   <button
        //     type="button"
        //     onClick={
        //       () => console.log('onclick dir')
        //       // todo: fix
        //       // electron.openDialogForNodeDataDir('test')
        //     }
        //     disabled={false}
        //     // disabled={sIsConfigDisabled}
        //   >
        //     Select folder
        //   </button>
        // </>
      )}
      {configTranslationControl?.type === 'text' && (
        <Input
          value={currentValue as string}
          onChange={(newValue: string) => onNodeConfigChange(newValue)}
          // isDisabled={sIsConfigDisabled}
          disabled={false}
        />
      )}
      {configTranslationControl?.type === 'select/single' && (
        <Select
          value={currentValue as string}
          // defaultValue={configTranslation.defaultValue}
          onChange={(newValue) => onNodeConfigChange(newValue?.value)}
          options={configTranslationControl.controlTranslations.map(
            ({ value }) => {
              return { value, label: value };
            }
          )}
          // isDisabled={sIsConfigDisabled}
          isDisabled={false}
        />
      )}
      {configTranslationControl?.type === 'select/multiple' && (
        <MultiSelect
          value={currentValue}
          // defaultValue={configTranslation.defaultValue}
          onChange={(newValue) => onNodeConfigChange(newValue)}
          options={configTranslationControl.controlTranslations.map(
            ({ value }) => {
              return { value, label: value };
            }
          )}
          // isDisabled={sIsConfigDisabled}
          isDisabled={false}
          isMulti={configTranslationControl?.type === 'select/multiple'}
        />
      )}
    </div>
  );
};
export default Setting;
