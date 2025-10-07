import pc from "picocolors"

export const loading = () => {
	const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	let i = 0;
	let interval: { value: NodeJS.Timeout | null } = { value: null };
	const start = () => {
		interval.value = setInterval(() => {
			const frame = frames[i = (i + 1) % frames.length];
			console.clear();
			console.log(
				`\r${pc.green(frame)} Processing image(s)...`
			);
		}, 120);
	}

	const end = () => {
		clearInterval(interval.value!);
		console.clear();
	}

	return {
		start,
		end,
	}
};

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
		console.log(pc.green(`\n✅ Completed in ${seconds}s`));
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
