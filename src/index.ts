import type { Plugin } from "vite";
import { Options } from "./types";
import { debounce, delay, deleteMatching, generateImages, options, pathToRegex, processFileQueue, processQueue, processQueues, removeQueue, setOptions } from "./utils/utils";
import pc from "picocolors"

const viteConvertImages = (_options?: Options): Plugin => {
	setOptions(_options || {});

	return {
		name: "vite-plugin-convert-images",
		watchChange: async (id, change) => {
			const path = pathToRegex(options.assetsDir!);
			const regex = new RegExp(
				`^(.+${path}.*?)([^/]+)@(\\d)x\\.(png|jpe?g|webp|avif)$`,
				"i"
			);

			const match = id.match(regex);
			const directory = match?.[1];
			const baseFilename = match?.[2];
			const scale = match?.[3];
			const extension = match?.[4];

			if (!match || !extension) return;

			if (processFileQueue.has(`${directory}${baseFilename}`)) return;
			processFileQueue.add(`${directory}${baseFilename}`);

			if (change.event === 'create' || change.event === 'update') {
				processQueue.push(async () => await generateImages(id, `${directory}${baseFilename}`, parseInt(scale!), options));

				debounce(async () => {
					processQueues(directory!, baseFilename!, options);
				}, 100)
			}

			if (change.event === 'delete') {
				if (removeQueue.has(`${directory}${baseFilename}`)) return;
				removeQueue.add(`${directory}${baseFilename}`);
				await deleteMatching(directory!, new RegExp(`${baseFilename}@.*`));
				await delay(200);
				console.log(`\n\n🗑️ File deleted: ${pc.redBright(baseFilename)}`);
				removeQueue.delete(`${directory}${baseFilename}`);
				processFileQueue.delete(`${directory}${baseFilename}`);
			}
		}
	}
}

export default viteConvertImages;
