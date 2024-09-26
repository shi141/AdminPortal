import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
  export default defineConfig({
    server: {
      port: 3000,
    },
    build: {
      outDir: './build'
    },
    plugins: [react()],
    optimizeDeps: {
      include: ['@mui/material/Tooltip', '@emotion/styled',  '@mui/icons-material', '@mui/material/Unstable_Grid2'],
    },
  })

