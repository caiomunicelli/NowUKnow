import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Base do backend
        changeOrigin: true, // Ajusta o cabeçalho Host para coincidir com o backend
        secure: false, // Ignora certificados HTTPS inválidos, se necessário
        rewrite: (path) => path, // Sem alteração no caminho
      },
    },
  },
});
