import pc from "picocolors"
import readline from 'readline';

export const renderProgressBar = (done: number, total: number, width = 30) => {
	const ratio = total === 0 ? 0 : done / total;
	const filled = Math.round(width * ratio);
	const empty = width - filled;
	const bar = `${pc.green('█').repeat(filled)}${pc.dim('░').repeat(empty)}`;
	return `[${bar}] ${done}/${total}`;
}

export const updateProgressBar = (done: number, total: number) => {
	readline.cursorTo(process.stdout, 0);
	process.stdout.write(`${renderProgressBar(done, total)}`);
}

export const formatBytes = (bytes: number) => {
	const units = [
		{ name: 'GB', value: 1024 ** 3 },
		{ name: 'MB', value: 1024 ** 2 },
		{ name: 'KB', value: 1024 },
		{ name: 'Bytes', value: 1 }
	];

	for (const unit of units) {
		if (bytes >= unit.value) {
			return (bytes / unit.value).toFixed(2) + ' ' + unit.name;
		}
	}

	return '0 Bytes';
}

export const completionTime = () => {
	let _start = 0;
	const start = () => {
		_start = performance.now()
	}

	const end = () => {
		const end = performance.now();
		const seconds = ((end - _start) / 1000).toFixed(2);
		console.log(pc.green(`\n\n✅ Completed in ${seconds}s`));
	}

	return {
		start,
		end,
	}
}

export const logGeneratedFiles = (files: string[]) => {
	if (files.length > 0) {
		console.log(pc.blue('\n📸 Generated files:'));
		files.forEach(file => console.log(` • ${file}`));
		files.length = 0;
	}
};
