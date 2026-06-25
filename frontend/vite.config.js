import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Your existing API proxies
      "/api": "http://localhost:5000",
      "/Login": "http://localhost:5000",
      "/Create": "http://localhost:5000", 
      "/Logout": "http://localhost:5000",
      "/verify-auth": "http://localhost:5000",
      
      // ADD THESE NEW PROXIES FOR HLS STREAMING
      "/hls": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('🔍 HLS proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📺 HLS request:', req.url);
          });
        },
      },
      
      // ADD TEST ENDPOINT PROXY
      "/test-ffmpeg": "http://localhost:5000",
      
      // OPTIONAL: Add these if you're serving images/videos from backend
      "/photos": "http://localhost:5000",
      "/videos": "http://localhost:5000"
    },
  },
})





  

// small changes in very aspect fix and then it goood to go in whole app