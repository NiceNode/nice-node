import { ReactComponent as Settings } from './Settings.svg';
import { ReactComponent as Play } from './Play.svg';
import { ReactComponent as Bell } from './Bell.svg';
import { ReactComponent as Add } from './Add.svg';
import { ReactComponent as Preferences } from './Preferences.svg';
import { ReactComponent as Popup } from './Popup.svg';

export interface Icons {
  settings?: React.ReactNode;
  play?: React.ReactNode;
  bell?: React.ReactNode;
  add?: React.ReactNode;
  preferences?: React.ReactNode;
  popup?: React.ReactNode;
}

// Define all icons here
export const ICONS: Icons = {
  settings: <Settings />,
  play: <Play />,
  bell: <Bell />,
  add: <Add />,
  preferences: <Preferences />,
  popup: <Popup />,
};

export type IconId = keyof Icons;
