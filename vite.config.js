import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        strictPort: true,
        port: 8080,
    },
    resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (!id.includes("node_modules"))
                        return;
                    if (id.includes("three"))
                        return "vendor-three";
                    if (id.includes("framer-motion"))
                        return "vendor-motion";
                    if (id.includes("@mui") || id.includes("@emotion"))
                        return "vendor-mui";
                    if (id.includes("@nivo"))
                        return "vendor-charts";
                    if (id.includes("react-dom") || id.includes("react/"))
                        return "vendor-react";
                    if (id.includes("lucide-react") || id.includes("@heroicons") || id.includes("react-icons"))
                        return "vendor-icons";
                    return "vendor";
                },
            },
        },
    }
});
