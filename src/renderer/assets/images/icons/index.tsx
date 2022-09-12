const settings = require('./Settings.svg');
const play = require('./Play.svg');
const bell = require('./Bell.svg');
const add = require('./Add.svg');
const preferences = require('./Preferences.svg');
const popup = require('./Popup.svg');

export interface Icons {
  settings?: string;
  play?: string;
  bell?: string;
  add?: string;
  preferences?: string;
  popup?: string;
}

// Define all icons here
export const ICONS: Icons = {
  settings,
  play,
  bell,
  add,
  preferences,
  popup,
};

export type IconId = keyof Icons;
