import sharp from 'sharp';
import { readdir, unlink } from "fs/promises";
import path from "path";
import pc from "picocolors"
import { timer, logGeneratedFiles, updateProgressBar } from './helpers';
import { generateLqip, generatorMap } from './generators';
import { BaseOptions } from 'src/types';

let isProcessing = false;
const queueTimer = timer();

export let processQueue: (() => Promise<void>)[] = [];
export const processFileQueue = new Set<string>();
export const removeQueue = new Set<string>();
export const generetedFiles: string[] = [];
export let options: BaseOptions = {
	assetsDir: '/src/assets',
	removableExtensions: [],
	formats: ['avif', 'webp'],
	formatOptions: {
		avif: {
			quality: 70,
			effort: 4,
			chromaSubsampling: '4:2:0',
		},
		webp: {
			quality: 90,
			effort: 4,
			smartSubsample: true,
			nearLossless: false,
		}
	},
	batchSize: 4,
	enableLogs: false,
}
/** Set or update options
 * @param _options Options
 */
export const setOptions = (_options: any) => {
	options = { ...options, ..._options }
}

/** Escape special characters in a path string for use in a regular expression
 * @param path Path string
 * @returns Escaped path string
 */
export const pathToRegex = (path: string): string => {
	return path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


/**
 * Generate images in .webp and .avif formats at different scales
 * @param input input file path
 * @param output output file path without scale and extension
 * @param initialScale initial scale (e.g., 2 for @2x)
 * @param options Options
 */
export const generateImages = async (input: string, directory: string, baseFilename: string, initialScale: number = 1, options: BaseOptions) => {
	const output = path.resolve(`${directory}${baseFilename}`);
	const sharpOriginal = sharp(input);
	const sharpInstance = sharpOriginal.clone();
	const { width } = await sharpInstance.metadata();
	if (!width) return;
	const promises: Promise<void>[] = [];
	// GENERATE .WEBP, .AVIF CONVERSIONS
	for (let i = initialScale; i > 0; i--) {
		const _scale = i;
		const scaledWidth = Math.round(width * (_scale / initialScale));
		sharpInstance.resize(scaledWidth);
		options.formats?.forEach(format => {
			const generator = generatorMap[format];
			promises.push(generator.generate(sharpInstance, `${output}@${_scale}x.${generator.extension}`, options.formatOptions?.[format]));
		})
	}
	// GENERATE LQIP IMAGE
	sharpInstance.resize(64);
	promises.push(
		generateLqip(sharpInstance, `${output}@lqip.webp`),
	);
	await Promise.allSettled(promises);
	options?.removableExtensions?.forEach(async ext => {
		await deleteMatching(directory!, new RegExp(`${baseFilename}@.*.${ext}`));
	});

}

/** Run promises with concurrency limit
 * @param tasks Array of functions returning promises
 * @param limit Concurrency limit
 * @returns Array of PromiseSettledResult
 */
export const runWithConcurrency = async <T>(
	tasks: (() => Promise<T>)[],
	limit: number
): Promise<PromiseSettledResult<T>[]> => {
	const results: PromiseSettledResult<T>[] = [];
	const executing: Promise<void>[] = [];

	for (const task of tasks) {
		const p = Promise.resolve()
			.then(task)
			.then(
				value => results.push({ status: 'fulfilled', value }),
				reason => results.push({ status: 'rejected', reason })
			)
			.finally(() => {
				const idx = executing.indexOf(p as any);
				if (idx >= 0) executing.splice(idx, 1);
			});

		executing.push(p as any);

		if (executing.length >= limit) {
			await Promise.race(executing);
		}
	}

	await Promise.allSettled(executing);

	return results;
}

/** Process the queue of image generation tasks
 * @param directory Directory path
 * @param baseFilename Base filename without scale and extension
 * @param options Options
 */
export const processQueues = async (directory: string, baseFilename: string, options: BaseOptions) => {
	if (isProcessing) return;
	isProcessing = true;
	console.clear();
	queueTimer.start();
	while (processQueue.length > 0) {
		await new Promise(r => setTimeout(r, 100));
		const batch = processQueue.slice();
		processQueue.length = 0;

		const total = batch.length;
		let done = 0;

		console.log(pc.cyan(`\n\n 🛠️  Processing ${total} image(s)...`));
		updateProgressBar(done, total);

		await runWithConcurrency(
			batch.map(item => async () => {
				try {
					await item();
				} finally {
					done++;
					updateProgressBar(done, total);
				}
			}),
			options.batchSize || 4
		);
	}
	isProcessing = false;
	options.enableLogs && logGeneratedFiles(generetedFiles);
	queueTimer.end();
	await delay(200);
	processFileQueue.clear();
}

/** Delay for a specified number of milliseconds
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Delete files in a directory matching a pattern
 * @param dir Directory path
 * @param pattern RegExp pattern to match filenames
 */
export const deleteMatching = async (dir: string, pattern: RegExp) => {
	const files = await readdir(dir);
	const matches = files.filter(f => pattern.test(f));

	return new Promise<void>(async (resolve) => {
		await Promise.allSettled(matches.map(async (f) => await unlink(path.join(dir, f))));

		resolve();
	});
}

/** Debounce function */
let timeout: { value: NodeJS.Timeout | null } = { value: null };
export const debounce = (cb: () => void, wait: number) => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
	timeout.value = setTimeout(() => {
		cb();
	}, wait);
};
