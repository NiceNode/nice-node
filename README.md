# NiceNode

Run a node at home, the easy way.

Set up an Ethereum node in no-time on every modern computer without any technical knowledge (coming soon).

For the latest information, visit https://nicenode.xyz

[![Downloads](https://badgen.net/badge/icon/alpha?label=downloads)](https://www.nicenode.xyz/#download)
[![Github All Releases](https://img.shields.io/github/downloads/NiceNode/nice-node/total.svg)]()
[![gitpoap badge](https://public-api.gitpoap.io/v1/repo/NiceNode/nice-node/badge)](https://www.gitpoap.io/gh/NiceNode/nice-node)
[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=NiceNode)](https://twitter.com/NiceNodeApp)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/k3dpYU4Pn9)

<img width="1164" alt="Nice Node Screenshot captioned work in progress" src="https://user-images.githubusercontent.com/3721291/213537206-fa5380f4-af5b-4d81-a07b-ea9072f07b24.png">

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

To set env vars locally, create a `.env` file at the top level with:

```
SENTRY_DSN=<...>
MP_PROJECT_TOKEN=<...>
MP_PROJECT_ENV=<...>
NICENODE_ENV=development
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

For a specific platform & architecture:

```bash
npm run package -- --linux --arm64
```

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
```
