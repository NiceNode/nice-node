/**
 * Uses TypedEmitter implementation based on tiny-typed-emitter
 * @see https://github.com/binier/tiny-typed-emitter
 * @license MIT
 */

import EventEmitter from 'node:events';
import { type AutoUpdater, autoUpdater as _autoUpdater } from 'electron';
import { checkForUpdates } from './../updater';
import { TypedEmitter } from './typed-emitter.js';

import { isLinux } from '../platform';
import { findPackageManager } from './findPackageManager';
import * as githubReleases from './githubReleases';

findPackageManager();

/**
 * event Event
 * releaseNotes string
 * releaseName string
 * releaseDate Date
 * updateURL string
 */
type UpdateDownloadedData = [Event, string, string, Date, string];

export type AppUpdaterEvents = {
  error: (error: Error, message?: string) => void;
  'checking-for-update': () => void;
  'update-not-available': () => void;
  'update-available': () => void;
  'update-downloaded': (...data: UpdateDownloadedData) => void;
  'download-progress': () => void;
  'update-cancelled': () => void;
};

let numTimeCalledConstructor = 0;

export class nnAutoUpdater
  extends TypedEmitter<AppUpdaterEvents>
  implements AutoUpdater
{
  private readonly nativeUpdater: AutoUpdater = _autoUpdater;
  private customUpdater: AutoUpdater | null = null;

  constructor() {
    console.log('nnAutoUpdater constructor');
    numTimeCalledConstructor++;
    if (numTimeCalledConstructor > 1) {
      throw new Error('nnAutoUpdater constructor called more than once!');
    }
    super();
  }

  emitCallback(e: any): void {
    console.log('emitCallback e = ', e);
    this.emit(e);
  }

  checkForUpdates(): void {
    // custom logic for linux as the native autoUpdater does not support linux
    console.log('nnAutoUpdater checkForUpdates called');
    if (isLinux()) {
      console.log('nnAutoUpdater checkForUpdates in linux!');
      this.emit('checking-for-update');
      githubReleases.checkForUpdates(this.emitCallback.bind(this));
    } else {
      this.nativeUpdater.checkForUpdates();
    }
  }
  getFeedURL(): string {
    console.log('nnAutoUpdater getFeedURL called');
    if (isLinux()) {
      console.log('nnAutoUpdater getFeedURL in linux!');
      throw new Error('Method not implemented.');
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return this.nativeUpdater.getFeedURL();
    }
  }
  quitAndInstall(): void {
    console.log('nnAutoUpdater quitAndInstall called');
    if (isLinux()) {
      console.log('nnAutoUpdater quitAndInstall in linux!');
      githubReleases.quitAndInstall();
    } else {
      this.nativeUpdater.quitAndInstall();
    }
  }
  setFeedURL(options: Electron.FeedURLOptions): void {
    console.log('nnAutoUpdater setFeedURL called');
    if (isLinux()) {
      console.log('nnAutoUpdater setFeedURL in linux!');
    } else {
      try {
        this.nativeUpdater.setFeedURL(options);
      } catch (e) {
        console.error('Error in setFeedURL: ', e);
      }
    }
  }
}

export const autoUpdater = new nnAutoUpdater();
