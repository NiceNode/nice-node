import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from "vite-plugin-svgr";

import { pluginExposeRenderer } from './vite.base.config.js';

console.log("vite.renderer.config.ts");

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf?.name ?? '';

  const plugins: PluginOption[] = []
  if(process.env.NODE_ENV !== 'test') {
    plugins.push(pluginExposeRenderer(name))
  }
  plugins.push(vanillaExtractPlugin(), svgr())
  console.log("vite.renderer.config.ts plugins: ", plugins);

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      publicDir: 'assets'
    },
    plugins,
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
