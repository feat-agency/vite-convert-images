import { defineConfig } from 'tsup';

export default defineConfig((options) => {
	return {
		entry: ['src/index.ts', '!docs'],
		format: ['cjs', 'esm'],
		dts: true,
		clean: true,
		minify: !options.watch,
	};
});
