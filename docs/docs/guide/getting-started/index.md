# Getting started
## Installation
Install the package with a package manager:
```bash
npm i vite-convert-images
```
## Basic Usage
Add `viteConvertImages()` to `vite.config.ts`.
```ts
import { defineConfig } from 'vite'
import viteConvertImages from 'vite-convert-images'

export default defineConfig({
	plugins: [
		viteConvertImages(),
	],
});
```
::: warning Important note
File names must end with `@2x` or `@3x` etc to trigger the image processing. It's important because the plugin generates all scaled conversions from this.
:::
