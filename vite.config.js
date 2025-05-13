import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',  
  server: {
    port: 3000, 
  },
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Access-Control-Allow-Origin': '*',
  },
});
