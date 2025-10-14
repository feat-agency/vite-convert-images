import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "🖼️ Vite Convert Images",
	description: "Convert images to modern formats and create different conversions.",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Documentation', link: '/guide/getting-started/index.md' }
		],
		outline: {
			level: 'deep',
		},
		sidebar: [
			{
				// text: 'Getting Started',

				items: [
					{ text: 'Getting Started', link: '/guide/getting-started/index.md', },
					{ text: 'Options', link: '/guide/options/index.md' }
				]
			},
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/feat-agency/vite-convert-images' }
		]
	}
})
