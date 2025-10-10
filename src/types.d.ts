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
	 * @param {Fmts} formats - Image formats to convert to
	 */
	formats?: NonEmptyTuple<F>;
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
	 * @param {Exclude<ImageFormat, Fmts[number]>[]} removableExtensions - Remove files with these extensions when the conversion finishes
	 */
	removableExtensions?: Exclude<ImageFormat, F>[];
	/**
	 * @param {number} batchSize - Number of concurrent image processing tasks
	 * @default 4
	 */
	batchSize?: number;
	/**
	 * @param {boolean} enableLogs - Log generated files to the console
	 * @default true
	 */
	enableLogs?: boolean;
};

