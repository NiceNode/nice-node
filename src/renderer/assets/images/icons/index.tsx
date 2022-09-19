const settings = require('./settings.svg');
const play = require('./play.svg');
const bell = require('./bell.svg');
const add = require('./add.svg');
const preferences = require('./preferences.svg');
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
