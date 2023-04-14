/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, '/src') },
      { find: '@pages', replacement: path.resolve(__dirname, '/src/pages') },
      { find: '@store', replacement: path.resolve(__dirname, '/src/store') },
    ],
  },
})
