// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	css: ["./app/assets/css/main.css"],
	modules: ["@tresjs/nuxt", "@vueuse/nuxt"],
	vite: {
		plugins: [tailwindcss()],
	},
});
