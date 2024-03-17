import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Define environment variables
  define: {
    'process.env': {
      // Add environment variables from .env file
      API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
      // Add other environment variables as needed
    },
  },

  // Other configurations...
  server: {
    proxy: { "/api": "http://backend:3002" },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
  }
});
