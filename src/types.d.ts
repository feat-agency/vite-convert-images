import { AvifOptions, JpegOptions, PngOptions, WebpOptions } from 'sharp';


export type ImageFormat = 'avif' | 'webp' | 'png' | 'jpg';
export type DefaultFormats = ['avif', 'webp'];
type NonEmptyTuple<T> = [T, ...T[]];
export type BaseOptions<F extends ImageFormat = DefaultFormats[number] | ImageFormat> = {
	/**
	 * @param {string} assetsDir - Assets directory path
	 * @default "/src/assets",
	 */
	assetsDir?: string;
	/**
	 * @param {ImageFormat[]} formats - Image formats to convert to
	 */
	formats?: NonEmptyTuple<F> | ImageFormat[];
	/**
	 * @param {Record<string, any>} formatOptions - Options for each format
	 */
	formatOptions?: {
		[key: string]: any;
		avif?: AvifOptions;
		webp?: WebpOptions;
		jpg?: JpegOptions;
		png?: PngOptions;
	},
	/**
	 * @param {Exclude<ImageFormat, F>[]} removableExtensions - Remove files with these extensions when the conversion finishes
	 */
	removableExtensions?: Exclude<ImageFormat, F>[];
	/**
	 * @param {number} batchSize - Number of concurrent image processing tasks
	 * @default 4
	 */
	batchSize?: number;
	/**
	 * @param {boolean} enableScaledVariants - Generate scaled variants based on the highest-resolution image
	 * @default true
	 */
	enableScaledVariants?: boolean;
	/**
	 * @param {boolean} enableLogs - Log generated files to the console
	 * @default true
	 */
	enableLogs?: boolean;
	/**
	 * @param {RegExp} nameLabel - Regular expression to capture a label in the filename (e.g., '@2x', '-large', '_thumbnail')
	 */
	nameLabel?: RegExp;
};

