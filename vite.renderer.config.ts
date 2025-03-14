import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';
import { pluginExposeRenderer } from './vite.base.config.js';
// import vitePluginRequire from 'vite-plugin-require';

// applies env vars from .env file(s)
dotenv.config();

console.log('vite.renderer.config.ts');

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf?.name ?? '';

  const plugins: PluginOption[] = [];
  if (process.env.NODE_ENV !== 'test') {
    plugins.push(pluginExposeRenderer(name));
  }
  plugins.push(vanillaExtractPlugin(), svgr());
  // plugins.push((vitePluginRequire as any).default());
  console.log('vite.renderer.config.ts plugins: ', plugins);

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      publicDir: 'assets',
    },
    plugins,
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
    define: {
      'import.meta.env.MP_PROJECT_TOKEN': JSON.stringify(
        process.env.MP_PROJECT_TOKEN,
      ),
      'import.meta.env.MP_PROJECT_ENV': JSON.stringify(
        process.env.MP_PROJECT_ENV,
      ),
      'import.meta.env.NICENODE_ENV': JSON.stringify(process.env.NICENODE_ENV),
      'import.meta.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
    },
  } as UserConfig;
});
