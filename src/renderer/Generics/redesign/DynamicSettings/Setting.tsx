import { useCallback, useEffect, useState } from "react";
import type {
	ConfigKey,
	ConfigTranslation,
	ConfigTranslationControl,
	ConfigValue,
} from "../../../../common/nodeConfig";
import type { SettingChangeHandler } from "../../../Presentational/NodeSettings/NodeSettingsWrapper";
import FolderInput from "../Input/FolderInput";
import Input from "../Input/Input";
import MultiSelect from "../Select/MultiSelect";
import Select from "../Select/Select";
import SyncModes from "../SyncModes/SyncModes";

export type SettingProps = {
	configTranslation: ConfigTranslation;
	configKey: ConfigKey;
	currentValue?: string | string[];
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
	const [sValue, setValue] = useState<string | string[]>();

	const onNodeConfigChange = useCallback(
		(newValue?: ConfigValue) => {
			const asyncUpdate = async () => {
				console.log("Setting value changed to newValue: ", newValue);
				if (onChange) {
					onChange(configKey, newValue);
				}
			};
			asyncUpdate();
		},
		[configKey, onChange],
	);

	// Settings.tsx are "controlled" input components in general, which means
	// the parent component dictates the value of the input after the parent
	// receives the onChange callback.
	// However,
	// If props.controlTranslation is undefined, and we use
	// the controlTranslation to set the currentValue, then we should
	// call onChange to notify the parent component(s). Without this,
	// or another fix, the user may see a value that isn't actually saved.
	useEffect(() => {
		let newValue = currentValue;
		if (currentValue === undefined) {
			if (configTranslation.niceNodeDefaultValue !== undefined) {
				newValue = configTranslation.niceNodeDefaultValue;
			} else if (configTranslation.defaultValue !== undefined) {
				newValue = configTranslation.defaultValue;
			}
			console.log(
				"Setting.tsx: currentValue === undefined. using default value",
				sValue,
				newValue,
			);
			onNodeConfigChange(newValue);
		}
		if (newValue !== sValue) {
			console.log(
				"Setting.tsx: setting new value. sValue, newValue",
				sValue,
				newValue,
			);
			setValue(newValue);
		}
	}, [currentValue]);

	const configTranslationControl: ConfigTranslationControl =
		configTranslation.uiControl;

	return (
		<div key={configKey}>
			{configTranslationControl?.type === "filePath" && (
				<FolderInput
					placeholder={sValue as string}
					disabled={isDisabled}
					onClickChange={onNodeConfigChange}
				/>
			)}
			{configTranslationControl?.type === "text" && (
				<Input
					value={sValue as string}
					onChange={(newValue: string) => onNodeConfigChange(newValue)}
					disabled={isDisabled}
					required={required}
				/>
			)}
			{configTranslationControl?.type === "select/single" &&
				configKey === "syncMode" && (
					<SyncModes
						value={sValue as string}
						controlTranslations={configTranslationControl.controlTranslations}
						onChange={(newValue: string) => onNodeConfigChange(newValue)}
						disabled={isDisabled}
					/>
				)}
			{configTranslationControl?.type === "select/single" &&
				configKey !== "syncMode" && (
					<Select
						value={sValue as string}
						onChange={(newValue) => onNodeConfigChange(newValue?.value)}
						options={configTranslationControl.controlTranslations.map(
							({ value }) => {
								return { value, label: value };
							},
						)}
						isDisabled={isDisabled}
					/>
				)}
			{configTranslationControl?.type === "select/multiple" && (
				<MultiSelect
					value={sValue}
					onChange={(newValue) => onNodeConfigChange(newValue)}
					options={configTranslationControl.controlTranslations.map(
						({ value }) => {
							return { value, label: value };
						},
					)}
					isDisabled={isDisabled ?? false}
					isMulti={configTranslationControl?.type === "select/multiple"}
				/>
			)}
		</div>
	);
};
export default Setting;
