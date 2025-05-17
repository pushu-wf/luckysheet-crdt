/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	base: "./",
	server: {
		port: 5000,
		host: "0.0.0.0",
		open: true,
		proxy: {
			"/api": {
				target: "http://localhost:9000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	plugins: [vue()],
	build: {
		outDir: "./server/public/dist",
	},
});
