/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	server: {
		port: 5000,
		host: '0.0.0.0',
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:9000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	},
	build: {
		outDir: './server/public/dist',
		rollupOptions: {
			input: {
				main: '/entry.html'
			}
		}
	}
});
