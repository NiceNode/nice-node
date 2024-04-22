import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import { Icon } from '../Icon/Icon';
import Input from './Input';
import {
  checkCircleIcon,
  container,
  freeStorageSpaceFontStyle,
  pathAndChangeContainer,
} from './folderInput.css';

export interface FolderInputProps {
  /**
   *  The folder path
   */
  placeholder?: string;
  /**
   *  Free storage space of the storage device where the folder
   *  is located (mounted).
   */
  freeStorageSpaceGBs?: number;
  /**
   *  Is this input field disabled?
   */
  disabled?: boolean;
  /**
   *  Provide to allow the user to change the folder location
   */
  onClickChange?: () => void;
}

const FolderInput = ({
  placeholder,
  freeStorageSpaceGBs,
  disabled,
  onClickChange,
}: FolderInputProps) => {
  const { t: g } = useTranslation('genericComponents');
  return (
    <div className={container}>
      <div className={pathAndChangeContainer}>
        <div style={{ flexGrow: 1 }}>
          <Input disabled placeholder={placeholder} />
        </div>
        <Button
          size="small"
          label={g('Change')}
          disabled={!onClickChange || disabled}
          onClick={onClickChange}
        />
      </div>
      {freeStorageSpaceGBs && (
        <div className={freeStorageSpaceFontStyle}>
          <div className={checkCircleIcon}>
            <Icon iconId="checkcircle" />
          </div>
          {g('AvailableDiskSpace', { space: Math.round(freeStorageSpaceGBs) })}
        </div>
      )}
    </div>
  );
};
export default FolderInput;
