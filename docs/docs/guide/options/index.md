# Config options

## `assetsDir`
Assets directory path
- Type: `string`
- Default `"/src/assets"`

## `formats`
Image formats to convert to
- Type: `ImageFormat[]`
- Default `['avif', 'webp']`

## `formatOptions`
Options for each format. This plugin using [`Sharp`](https://sharp.pixelplumbing.com/) behind the scene. Check the documentation for more detail about the different output options.

- `avif`
	- Type: [`AvifOptions`](https://sharp.pixelplumbing.com/api-output/#avif)
	- Default 
	```ts
	{
		quality: 70,
		effort: 4,
		chromaSubsampling: '4:2:0'
	}
	```
- `webp`
	- Type: [`WebpOptions`](https://sharp.pixelplumbing.com/api-output/#webp)
	```ts
	{
		quality: 90,
		effort: 4,
		smartSubsample: true,
		nearLossless: false,
	}
	```
- `jpg`
	- Type: [`JpegOptions`](https://sharp.pixelplumbing.com/api-output/#jpeg)
	- Default `Sharp default`
- `png`
	- Type: [`PngOptions`](https://sharp.pixelplumbing.com/api-output/#png)
	- Default `Sharp default`

## `removableExtensions`
Remove files with these extensions when the conversion finishes
- Type: `ImageFormat[]`
- Default `[]`

## `batchSize`
Number of concurrent image processing tasks
- Type `number`
- Default `4`

## `enableScaledVariants`
Generate scaled variants based on the highest-resolution image
- Type `boolean`
- Default `true`

## `enableLogs`
Log generated files to the console
- Type `boolean`
- Default `false`
