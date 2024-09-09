import { defineConfig } from "vite";
import { resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
        input: {
            main: resolve(__dirname, "index.html"),
            analyser: resolve(__dirname, "analyser.html"),
            empty: resolve(__dirname, "empty.html"),
        },
    },
},
})
