# NiceNode

"Run a node, just press start"

<strong>Mission: </strong>2x the number of Ethereum nodes by making a one-click-to-start Ethereum node

[![Downloads](https://badgen.net/badge/icon/alpha?label=downloads)](https://www.nicenode.xyz/downloads) [![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/k3dpYU4Pn9)

![NiceNodeScreenshot](https://www.nicenode.xyz/img/screenshot.png 'NiceNodeScreenshot')

<strong>Why?: </strong>The light client roadmap for Ethereum depends on access to reliable full nodes. Increasing the number and availability of full nodes is therefore important for the future of Ethereum.

<strong>Logo credits:</strong> Logo made by Artist, William Tempest, from https://ethereum.org/en/assets/

# Development

[![Test](https://github.com/jgresham/nice-node/actions/workflows/test.yml/badge.svg)](https://github.com/jgresham/nice-node/actions/workflows/test.yml)

## Install

Clone the repo and install dependencies:

```bash
git clone <nice node repo url>
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
```
