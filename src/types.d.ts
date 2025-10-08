import { AvifOptions, WebpOptions } from 'sharp';
export type Options = {
	/**
	 * @param {string} assetsDir - Assets directory path
	 * @default "/src/assets",
	 */
	assetsDir?: string;
	/**
	 * @param {('avif' | 'webp' | 'png' | 'jpg')[]} formats - Image formats to convert to
	 */
	formats?: ('avif' | 'webp' | 'png' | 'jpg')[];
	/**
	 * @param {Record<string, any>} formatOptions - Options for each format
	 */
	formatOptions?: {
		[key: string]: any;
		avif?: AvifOptions;
		webp?: WebpOptions;
	},
	/**
	 * @param {string[]} removableExtensions - Remove files with these extensions when the sconversion finishes
	 */
	removableExtensions?: string[];
	/**
	 * @param {AvifOptions} avifOptions - Avif conversion options
	 * @see {@link https://sharp.pixelplumbing.com/api-output#avif}
	 */
	avifOptions?: AvifOptions;
	/**
	 * @param {WebpOptions} webpOptions - Webp conversion options
	 * @see {@link https://sharp.pixelplumbing.com/api-output#webp}
	 */
	webpOptions?: WebpOptions;
	/**
	 * @param {number} batchSize - Number of concurrent image processing tasks
	 * @default 4
	 */
	batchSize?: number;
	/**
	 * @param {boolean} logGeneratedFiles - Log generated files to the console
	 * @default true
	 */
	logGeneratedFiles?: boolean;
}
