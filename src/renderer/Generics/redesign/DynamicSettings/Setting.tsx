import { useCallback } from 'react';
import {
  ConfigValue,
  ConfigTranslation,
  ConfigTranslationControl,
  ConfigKey,
} from '../../../../common/nodeConfig';
import FolderInput from '../Input/FolderInput';
import Input from '../Input/Input';
import Select from '../Select/Select';
import MultiSelect from '../Select/MultiSelect';
import { SettingChangeHandler } from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
import SyncModes from '../SyncModes/SyncModes';

export type SettingProps = {
  configTranslation: ConfigTranslation;
  configKey: ConfigKey;
  currentValue: string | string[];
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
  required?: boolean;
};
const Setting = ({
  configTranslation,
  configKey,
  currentValue,
  isDisabled,
  onChange,
  required,
}: SettingProps) => {
  const onNodeConfigChange = useCallback(
    (newValue?: ConfigValue) => {
      const asyncUpdate = async () => {
        console.log('Setting value changed to newValue: ', newValue);
        if (onChange) {
          onChange(configKey, newValue);
        }
      };
      asyncUpdate();
    },
    [configKey, onChange],
  );

  const configTranslationControl: ConfigTranslationControl =
    configTranslation.uiControl;

  return (
    <div key={configKey}>
      {configTranslationControl?.type === 'filePath' && (
        <FolderInput
          placeholder={currentValue as string}
          disabled={isDisabled}
          onClickChange={onNodeConfigChange}
        />
      )}
      {configTranslationControl?.type === 'text' && (
        <Input
          value={currentValue as string}
          onChange={(newValue: string) => onNodeConfigChange(newValue)}
          disabled={isDisabled}
          required={required}
        />
      )}
      {configTranslationControl?.type === 'select/single' &&
        configKey === 'syncMode' && (
          <SyncModes
            controlTranslations={configTranslationControl.controlTranslations}
            onChange={(newValue: string) => onNodeConfigChange(newValue)}
          />
        )}
      {configTranslationControl?.type === 'select/single' &&
        configKey !== 'syncMode' && (
          <Select
            value={currentValue as string}
            onChange={(newValue) => onNodeConfigChange(newValue?.value)}
            options={configTranslationControl.controlTranslations.map(
              ({ value }) => {
                return { value, label: value };
              },
            )}
            isDisabled={isDisabled}
          />
        )}
      {configTranslationControl?.type === 'select/multiple' && (
        <MultiSelect
          value={currentValue}
          onChange={(newValue) => onNodeConfigChange(newValue)}
          options={configTranslationControl.controlTranslations.map(
            ({ value }) => {
              return { value, label: value };
            },
          )}
          isDisabled={isDisabled ?? false}
          isMulti={configTranslationControl?.type === 'select/multiple'}
        />
      )}
    </div>
  );
};
export default Setting;
