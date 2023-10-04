/* eslint-disable prefer-destructuring */

// declares the type of the injected variable process from webpack plugin
declare let process: { env: Record<string, string> };

type Envs = 'dev' | 'staging' | 'prod';
// do not destruct because webpack replaces exact string match to 'process.env.<var>'
export const MP_PROJECT_TOKEN = process.env.MP_PROJECT_TOKEN;
export const MP_PROJECT_ENV: Envs =
  (process.env.MP_PROJECT_ENV as Envs) || 'dev';
