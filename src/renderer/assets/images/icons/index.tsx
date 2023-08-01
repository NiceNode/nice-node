import React from 'react';
import { ReactComponent as Add } from './Add.svg';
import { ReactComponent as Bell } from './Bell.svg';
import { ReactComponent as Binoculars } from './Binoculars.svg';
import { ReactComponent as Block } from './Block.svg';
import { ReactComponent as Blocks } from './Blocks.svg';
import { ReactComponent as BoltStrike } from './Bolt-strike.svg';
import { ReactComponent as Bolt } from './Bolt.svg';
import { ReactComponent as Calendar } from './Calendar.svg';
import { ReactComponent as CheckBadgeFilled1 } from './Check-badge-filled-1.svg';
import { ReactComponent as CheckBadgeFilled } from './Check-badge-filled.svg';
import { ReactComponent as CheckCircleFilled } from './Check-circle-filled.svg';
import { ReactComponent as CheckCircle } from './Check-circle.svg';
import { ReactComponent as CheckDouble } from './Check-double.svg';
import { ReactComponent as Check } from './Check.svg';
import { ReactComponent as CloseCircleFilled } from './Close-circle-filled.svg';
import { ReactComponent as CloseCircle } from './Close-circle.svg';
import { ReactComponent as Close } from './Close.svg';
import { ReactComponent as Copy } from './Copy.svg';
import { ReactComponent as Cpu } from './CPU.svg';
import { ReactComponent as Disk } from './Disk.svg';
import { ReactComponent as Disks } from './Disks.svg';
import { ReactComponent as DownLarge } from './Down-large.svg';
import { ReactComponent as Down } from './Down.svg';
import { ReactComponent as Download1 } from './Download-1.svg';
import { ReactComponent as Download } from './Download.svg';
import { ReactComponent as External } from './External.svg';
import { ReactComponent as FilterLargeFilled } from './Filter-large-filled.svg';
import { ReactComponent as FilterLarge } from './Filter-large.svg';
import { ReactComponent as Filter } from './Filter.svg';
import { ReactComponent as Ellipsis } from './Ellipsis.svg';
import { ReactComponent as Health } from './Health.svg';
import { ReactComponent as InfoCircleFilled } from './Info-circle-filled.svg';
import { ReactComponent as InfoCircle } from './Info-circle.svg';
import { ReactComponent as LeftLarge } from './Left-large.svg';
import { ReactComponent as Left } from './Left.svg';
import { ReactComponent as Lightning } from './Lightning.svg';
import { ReactComponent as Logs } from './Logs.svg';
import { ReactComponent as Mail } from './Mail.svg';
import { ReactComponent as DarkMode } from './Nicenode-darkmode.svg';
import { ReactComponent as LightMode } from './Nicenode-lightmode.svg';
import { ReactComponent as Nodes } from './Nodes.svg';
import { ReactComponent as Peers } from './Peers.svg';
import { ReactComponent as Play } from './Play.svg';
import { ReactComponent as Popup } from './Popup.svg';
import { ReactComponent as Preferences } from './Preferences.svg';
import { ReactComponent as RightLarge } from './Right-large.svg';
import { ReactComponent as Right } from './Right.svg';
import { ReactComponent as ScrollFill } from './Scroll-fill.svg';
import { ReactComponent as Scroll } from './Scroll.svg';
import { ReactComponent as Search } from './Search.svg';
import { ReactComponent as Settings } from './Settings.svg';
import { ReactComponent as Shape1 } from './Shape1.svg';
import { ReactComponent as Shape2 } from './Shape2.svg';
import { ReactComponent as Shape3 } from './Shape3.svg';
import { ReactComponent as Shape4 } from './Shape4.svg';
import { ReactComponent as Slots } from './Slots.svg';
import { ReactComponent as Speedometer } from './Speedometer.svg';
import { ReactComponent as SpinnerEndless } from './Spinner-endless.svg';
import { ReactComponent as Stop } from './Stop.svg';
import { ReactComponent as SyncSmall } from './Sync-small.svg';
import { ReactComponent as Sync } from './Sync.svg';
import { ReactComponent as Syncing } from './Syncing.svg';
import { ReactComponent as Updating } from './Spinner.svg';
import { ReactComponent as UpdatingSmall } from './Spinner-small.svg';
import { ReactComponent as UpLarge } from './Up-large.svg';
import { ReactComponent as Up } from './Up.svg';
import { ReactComponent as WarningCircleFilled } from './Warning-circle-filled.svg';

export interface Icons {
  add?: React.ReactNode;
  bell?: React.ReactNode;
  binoculars?: React.ReactNode;
  blank?: React.ReactNode;
  block?: React.ReactNode;
  blocks?: React.ReactNode;
  boltstrike?: React.ReactNode;
  bolt?: React.ReactNode;
  calendar?: React.ReactNode;
  checkbadgefilled1?: React.ReactNode;
  checkbadgefilled?: React.ReactNode;
  checkcirclefilled?: React.ReactNode;
  checkcircle?: React.ReactNode;
  checkdouble?: React.ReactNode;
  check?: React.ReactNode;
  closecirclefilled?: React.ReactNode;
  closecircle?: React.ReactNode;
  close?: React.ReactNode;
  copy?: React.ReactNode;
  cpu?: React.ReactNode;
  disk?: React.ReactNode;
  disks?: React.ReactNode;
  downlarge?: React.ReactNode;
  down?: React.ReactNode;
  download1?: React.ReactNode;
  download?: React.ReactNode;
  external?: React.ReactNode;
  ellipsis?: React.ReactNode;
  filterlargefilled?: React.ReactNode;
  filterlarge?: React.ReactNode;
  filter?: React.ReactNode;
  health?: React.ReactNode;
  infocirclefilled?: React.ReactNode;
  infocircle?: React.ReactNode;
  leftlarge?: React.ReactNode;
  left?: React.ReactNode;
  lightning?: React.ReactNode;
  logs?: React.ReactNode;
  mail?: React.ReactNode;
  darkmode?: React.ReactNode;
  lightmode?: React.ReactNode;
  nodes?: React.ReactNode;
  peers?: React.ReactNode;
  play?: React.ReactNode;
  popup?: React.ReactNode;
  preferences?: React.ReactNode;
  rightlarge?: React.ReactNode;
  right?: React.ReactNode;
  scrollfill?: React.ReactNode;
  scroll?: React.ReactNode;
  search?: React.ReactNode;
  settings?: React.ReactNode;
  shape1?: React.ReactNode;
  shape2?: React.ReactNode;
  shape3?: React.ReactNode;
  shape4?: React.ReactNode;
  slots?: React.ReactNode;
  speedometer?: React.ReactNode;
  spinnerendless?: React.ReactNode;
  stop?: React.ReactNode;
  syncsmall?: React.ReactNode;
  sync?: React.ReactNode;
  syncing?: React.ReactNode;
  updating?: React.ReactNode;
  updatingsmall?: React.ReactNode;
  uplarge?: React.ReactNode;
  up?: React.ReactNode;
  warningcirclefilled?: React.ReactNode;
}

// Define all icons here
export const ICONS: Icons = {
  add: <Add />,
  bell: <Bell />,
  binoculars: <Binoculars />,
  blank: <></>,
  block: <Block />,
  blocks: <Blocks />,
  boltstrike: <BoltStrike />,
  bolt: <Bolt />,
  calendar: <Calendar />,
  checkbadgefilled1: <CheckBadgeFilled1 />,
  checkbadgefilled: <CheckBadgeFilled />,
  checkcirclefilled: <CheckCircleFilled />,
  checkcircle: <CheckCircle />,
  checkdouble: <CheckDouble />,
  check: <Check />,
  closecirclefilled: <CloseCircleFilled />,
  closecircle: <CloseCircle />,
  close: <Close />,
  copy: <Copy />,
  cpu: <Cpu />,
  disk: <Disk />,
  disks: <Disks />,
  downlarge: <DownLarge />,
  down: <Down />,
  download1: <Download1 />,
  download: <Download />,
  external: <External />,
  ellipsis: <Ellipsis />,
  filterlargefilled: <FilterLargeFilled />,
  filterlarge: <FilterLarge />,
  filter: <Filter />,
  health: <Health />,
  infocirclefilled: <InfoCircleFilled />,
  infocircle: <InfoCircle />,
  leftlarge: <LeftLarge />,
  left: <Left />,
  logs: <Logs />,
  lightning: <Lightning />,
  mail: <Mail />,
  darkmode: <DarkMode />,
  lightmode: <LightMode />,
  nodes: <Nodes />,
  peers: <Peers />,
  play: <Play />,
  popup: <Popup />,
  preferences: <Preferences />,
  rightlarge: <RightLarge />,
  right: <Right />,
  scrollfill: <ScrollFill />,
  scroll: <Scroll />,
  search: <Search />,
  settings: <Settings />,
  shape1: <Shape1 />,
  shape2: <Shape2 />,
  shape3: <Shape3 />,
  shape4: <Shape4 />,
  slots: <Slots />,
  speedometer: <Speedometer />,
  spinnerendless: <SpinnerEndless />,
  stop: <Stop />,
  syncsmall: <SyncSmall />,
  sync: <Sync />,
  syncing: <Syncing />,
  updating: <Updating />,
  updatingsmall: <UpdatingSmall />,
  uplarge: <UpLarge />,
  up: <Up />,
  warningcirclefilled: <WarningCircleFilled />,
} as const;

export type IconId = keyof Icons;
