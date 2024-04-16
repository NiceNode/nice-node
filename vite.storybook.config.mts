import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from "vite-plugin-svgr";

console.log("vite.storybook.config.ts");

// https://vitejs.dev/config
export default defineConfig((env) => {

  return {
    base: './',
    build: {
      outDir: '.vite/renderer/main_window',
      publicDir: 'assets'
    },
    plugins: [vanillaExtractPlugin(), svgr()],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
