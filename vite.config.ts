import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite'
import path from 'node:path'
import generator from './generator'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '~C/': `${path.resolve(__dirname, 'src/component')}/`,
      },
    },
    plugins: [
      UnoCSS(),
      react(),
      generator()
    ],
    server: {
      host:'0.0.0.0',
      port: 3000,
    },
  };
});
