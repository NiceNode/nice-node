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
import MultiSelect from '../Select/MultiSelect';
// import Warning from '../Warning';

type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
// isDisabled? selectedNodeId (for dialog)
export type SettingProps = {
  configTranslation: ConfigTranslation;
  configKey: ConfigKey;
  currentValue: string | string[];
  isDisabled?: boolean;
  onChange?: (configKey: string, newValue: ConfigValue) => void;
};
const Setting = ({
  configTranslation,
  configKey,
  currentValue,
  isDisabled,
  onChange,
}: SettingProps) => {
  const onNodeConfigChange = async (newValue: ConfigValue) => {
    // todo: updateNode
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
      {configTranslationControl?.type === 'filePath' && (
        <FolderInput
          placeholder={currentValue as string}
          disabled={isDisabled}
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
          disabled={isDisabled}
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
          isDisabled={isDisabled}
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
          isDisabled={isDisabled ?? false}
          isMulti={configTranslationControl?.type === 'select/multiple'}
        />
      )}
    </div>
  );
};
export default Setting;
