import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    
    base: '/Espa-o-pet/',
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: false,
      watch: {
        ignored: process.env.DISABLE_HMR === 'true' ? ['**'] : [],
      },
    },
  };
});
