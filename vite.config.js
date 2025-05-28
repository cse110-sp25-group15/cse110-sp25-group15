import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cse110-sp25-group15/', 
  root: 'src',  
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        listings: 'src/list.html',
        profile: 'src/profile.html',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
});