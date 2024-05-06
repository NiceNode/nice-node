Run a node at home, the easy way.

Set up an Ethereum node in no-time on every modern computer without any technical knowledge (coming soon).

For the latest information, visit https://nicenode.xyz

[![Downloads](https://badgen.net/badge/icon/alpha?label=downloads)](https://www.nicenode.xyz/#download)
[![Github All Releases](https://img.shields.io/github/downloads/NiceNode/nice-node/total.svg)]()
[![gitpoap badge](https://public-api.gitpoap.io/v1/repo/NiceNode/nice-node/badge)](https://www.gitpoap.io/gh/NiceNode/nice-node)
[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=NiceNode)](https://twitter.com/NiceNodeApp)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/k3dpYU4Pn9)
[![Crowdin](https://badges.crowdin.net/nicenode/localized.svg)](https://crowdin.com/project/nicenode)

<img width="1164" alt="Application Window Dark" src="https://github.com/NiceNode/nice-node/assets/3721291/835ced91-3a2f-4be6-a30e-11dd025fa20e">

# Development

[![Test](https://github.com/jgresham/nice-node/actions/workflows/test.yml/badge.svg)](https://github.com/jgresham/nice-node/actions/workflows/test.yml)

## Install

Install git, nodejs 18+, and npm.

Clone the repo and install dependencies:

```bash
git clone https://github.com/NiceNode/nice-node.git
cd nice-node
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

A window should pop open with NiceNode and a chrome devtools inspector running.

You may need to set environment variables locally. To do so, create a `.env` file at the top level with:

```
SENTRY_DSN=fake-token
MP_PROJECT_TOKEN=fake-token
MP_PROJECT_ENV=dev
NICENODE_ENV=development
```

`SENTRY_DSN` and `MP_PROJECT_TOKEN` should be fake unless testing. Contact Johns, @jgresham, if you want to test new error or event reporting code.

## Packaging for Production

To package apps for the local platform:

```bash
npm run make
```

For a specific platform & architecture:

```bash
npm run make -- --platform=linux --arch=arm64
npm run make -- --arch=x64 --platform=darwin
```
arch options include: ia32, x64, armv7l, arm64, mips64el, universal

## Tests

Unit tests with `npm run test`

### Frontend (React) tests
`npm run test -- --config vite.renderer.config.ts --dir src/__tests__/react`

### Backend (Nodejs) tests
`npm run test -- --config vite.main.config.ts --dir src/__tests__/node`

### End-to-end (e2e) tests

For e2e tests, we use webdriver and an electron plugin to automate testing.
It requires a packaged build to complete the tests.

To run them locally, package the source first (and after making any changes to anything other than `tests`), then run the e2e tests with `wdio`

```bash
npm run make <your os and arch>
npm run wdio
```

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
```


## Debugging ASAR and contents
`npx @electron/asar extract app.asar <destfolder>` can be used to determine the contents of asar

`npm run package` followed by `mkdir outAsar` and `npx @electron/asar extract ./out/NiceNode-darwin-arm64/NiceNode.app/Contents/Resources/app.asar outAsar` on macOS

## Debugging update server (macOS and Windows)
`curl https://update.electronjs.org/NiceNode/nice-node/darwin-arm64/5.2.0-alpha` returns if there is an update detected by the update server. The end of the URL is <platform>-<arch>/<version>.

Also, NiceNode app auto update logs are in ../NiceNode/logs/autoUpdater*.log.

