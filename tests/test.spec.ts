import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { delay, deleteMatching, generateImages, options } from "src/utils/utils";
import fs from 'fs/promises';
import path from 'path';
import { BaseOptions, } from 'src/types';

const tmpDir = path.resolve('tests/tmp');

beforeEach(async () => {
	await fs.rm(tmpDir, { recursive: true, force: true });
	await fs.mkdir(tmpDir, { recursive: true });
});

afterEach(async () => {
	await fs.rm(tmpDir, { recursive: true, force: true });
});

const generate = async (scale: number = 2, opt?: BaseOptions) => {
	const input = path.resolve('tests/fixtures/vite@2x.png');
	await generateImages(input, tmpDir + '/', 'vite', scale, { ...options, ...opt });
}

describe('generateImages', () => {
	it('creates @2x scaled variants and lqip', async () => {
		await generate();
		const files = await fs.readdir(tmpDir);

		expect(files).toContain('vite@2x.webp');
		expect(files).toContain('vite@1x.webp');
		expect(files).toContain('vite@2x.avif');
		expect(files).toContain('vite@1x.avif');
		expect(files).toContain('vite@lqip.webp');
	});

	it('creates @3x scaled variants and lqip', async () => {
		await generate(3);
		const files = await fs.readdir(tmpDir);

		expect(files).toContain('vite@3x.webp');
		expect(files).toContain('vite@2x.webp');
		expect(files).toContain('vite@1x.webp');
		expect(files).toContain('vite@3x.avif');
		expect(files).toContain('vite@2x.avif');
		expect(files).toContain('vite@1x.avif');
		expect(files).toContain('vite@lqip.webp');
	});

	it('creates @2x scaled variants, png, jpg, lqip', async () => {
		await generate(2, { formats: ['png', 'jpg'] });
		const files = await fs.readdir(tmpDir);

		expect(files).toContain('vite@2x.png');
		expect(files).toContain('vite@1x.png');
		expect(files).toContain('vite@2x.jpg');
		expect(files).toContain('vite@1x.jpg');
		expect(files).toContain('vite@lqip.webp');
	});

	it('disable scaled variants', async () => {
		await generate(2, { enableScaledVariants: false });
		const files = await fs.readdir(tmpDir);

		expect(files).toContain('vite@2x.webp');
		expect(files).toContain('vite@2x.avif');
		expect(files).toContain('vite@lqip.webp');
	});

	it('remove png after variants created', async () => {
		// @ts-ignore
		await generate(2, { formats: ['avif', 'png'], removableExtensions: ['png'] });
		await delay(1)
		const files = await fs.readdir(tmpDir);
		expect(files).toContain('vite@2x.avif');
		expect(files).not.toContain('vite@2x.png');
		expect(files).toContain('vite@lqip.webp');
	});


	it('remove images', async () => {
		await generate();
		await deleteMatching(tmpDir + '/', new RegExp('vite@.*'));
	})
});
