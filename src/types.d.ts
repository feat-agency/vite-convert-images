import { AvifOptions, WebpOptions } from 'sharp';
export type Options = {
	/**
	 * @param {string} assetsDir - Assets directory path
	 * @default "/src/assets/img",
	 */
	assetsDir?: string;
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
}
