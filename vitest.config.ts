/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

console.log("vitest.config.ts");

// https://vitejs.dev/config
export default defineConfig((env) => {
  return {
    plugins: [vanillaExtractPlugin()],
  }
});

// todo: reocmmended to join this with other vite configs
// https://vitest.dev/guide/#configuring-vitest
