import checkCircleFill from './checkCircleFill.svg';

const settings = require('./settings.svg');
const play = require('./play.svg');
const bell = require('./bell.svg');
const add = require('./add.svg');
const preferences = require('./preferences.svg');

export interface Icons {
  settings?: string;
  play?: string;
  bell?: string;
  add?: string;
  preferences?: string;
  checkCircleFill?: string;
}

// Define all icons here
export const ICONS: Icons = {
  settings,
  play,
  bell,
  add,
  preferences,
  checkCircleFill,
};

export type IconId = keyof Icons;
