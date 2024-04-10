import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from "vite-plugin-svgr";

import { pluginExposeRenderer } from './vite.base.config';

console.log("vite.renderer.config.ts");

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      publicDir: 'assets'
    },
    plugins: [pluginExposeRenderer(name), vanillaExtractPlugin(), svgr()],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
