import { Sharp, WebpOptions, AvifOptions, JpegOptions, PngOptions } from "sharp";
import { formatBytes } from "./helpers";
import pc from "picocolors"
import { generetedFiles } from "./utils";

/**
 * Generate .webp image
 * @param input Sharp instance
 * @param output output file path
 * @param options Sharp WebpOptions
 */
const generateWebp = async (input: Sharp, output: string, options: WebpOptions = {}) => {
	const img = await input
		.webp(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}

/**
 * Generate .avif image
 * @param input Sharp instance
 * @param output output file path
 * @param options Sharp WebpOptions
 */
const generateAvif = async (input: Sharp, output: string, options: AvifOptions = {}) => {
	const img = await input
		.avif(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}

/**
 * Generate .jpg image
 * @param input Sharp instance
 * @param output output file path
 * @param options Sharp WebpOptions
 */
const generateJpeg = async (input: Sharp, output: string, options: JpegOptions = {}) => {
	const img = await input
		.jpeg(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}
/**
 * Generate .png image
 * @param input Sharp instance
 * @param output output file path
 * @param options Sharp WebpOptions
 */
const generatePng = async (input: Sharp, output: string, options: PngOptions = {}) => {
	const img = await input
		.png(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}

/**
 * Generate LQIP image
 * @param input Sharp instance
 * @param output output file path
 * @param options Sharp WebpOptions
 */
export const generateLqip = async (input: Sharp, output: string) => {
	const img = await input
		.blur(3)
		.webp({ quality: 1 })
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}


export const generatorMap: Record<string, any> = {
	avif: {
		generate: generateAvif,
		extension: 'avif',
	},
	webp: {
		generate: generateWebp,
		extension: 'webp',
	},
	jpg: {
		generate: generateJpeg,
		extension: 'jpg',
	},
	png: {
		generate: generatePng,
		extension: 'png',
	},
}
