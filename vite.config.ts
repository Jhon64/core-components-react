import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ react()],
 
  build: {
    cssCodeSplit: false, 
    lib: {
      entry: "./src/index.ts",
      name: "jhon64corecomponents",
      formats: ["es", "umd"],
      fileName: (format) => `jhon64corecomponents.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})


