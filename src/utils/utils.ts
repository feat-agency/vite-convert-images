import sharp, { AvifOptions, Sharp, WebpOptions } from 'sharp';
import { readdir, unlink } from "fs/promises";
import path from "path";
import pc from "picocolors"
import { completionTime, formatBytes, loading, logGeneratedFiles } from './helpers';
import { Options } from 'src/types';

let isProcessing = false;
const generetedFiles: string[] = [];
const loader = loading();
const queueTime = completionTime()

export let processQueue: (() => Promise<void>)[] = [];
export const processFileQueue = new Set<string>();
export const removeQueue = new Set<string>();

export const pathToRegex = (path: string): string => {
	return path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const generateWebp = async (input: Sharp, output: string, options: WebpOptions = {}) => {
	const img = await input
		.webp(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}

export const generateAvif = async (input: Sharp, output: string, options: AvifOptions = {}) => {
	const img = await input
		.avif(options)
		.toFile(output);

	generetedFiles.push(`${output.split('/').splice(-1)} - ${pc.bold(formatBytes(img.size))} ${pc.dim(`(${img.width}px x ${img.height}px)`)}`);
}

export const generateImages = async (input: string, output: string, initialScale: number = 1, options: Options) => {
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
		promises.push(
			generateWebp(sharpInstance, `${output}@${_scale}x.webp`, options.webpOptions),
			generateAvif(sharpInstance, `${output}@${_scale}x.avif`, options.avifOptions)
		);
	}
	// GENERATE LQIP IMAGE
	sharpInstance.resize(64);
	promises.push(
		generateWebp(sharpInstance, `${output}@lqip.webp`, { quality: 1 }),
	);
	await Promise.allSettled(promises);

}

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

export const processQueues = async (directory: string, baseFilename: string, options: Options) => {
	if (isProcessing) return;
	isProcessing = true;
	queueTime.start();
	loader.start();
	while (processQueue.length > 0) {
		await new Promise(r => setTimeout(r, 100));
		const batch = processQueue.slice();
		processQueue.length = 0;

		await runWithConcurrency(batch, options.batchSize || 4);
	}
	if (options.removableExtensions) {
		options.removableExtensions.forEach(async ext => {
			await deleteMatching(directory!, new RegExp(`${baseFilename}@.*.${ext}`));
		});
	}
	isProcessing = false;
	loader.end();
	logGeneratedFiles(generetedFiles);
	queueTime.end();
	await delay(200);
	processFileQueue.clear();
}

export const delay = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const deleteMatching = async (dir: string, pattern: RegExp) => {
	const files = await readdir(dir);
	const matches = files.filter(f => pattern.test(f));

	return new Promise<void>(async (resolve) => {
		await Promise.allSettled(matches.map(async (f) => await unlink(path.join(dir, f))));

		resolve();
	});
}

let timeout: { value: NodeJS.Timeout | null } = { value: null };
export const debounce = (cb: () => void, wait: number) => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
	timeout.value = setTimeout(() => {
		cb();
	}, wait);
};
