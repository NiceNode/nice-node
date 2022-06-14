import process from 'node:process';
import { isMac } from '../platform';

export const fixPathEnvVar = () => {
  if (!isMac) {
    return;
  }
  // fix path env variable so that child processes paths
  // code from https://github.com/sindresorhus/fix-path
  console.log('Env var PATH before change: ', process.env.PATH);
  process.env.PATH = [
    './node_modules/.bin',
    '/.nodebrew/current/bin',
    '/usr/local/bin',
    process.env.PATH,
  ].join(':');
  console.log('Env var PATH after change: ', process.env.PATH);
};
