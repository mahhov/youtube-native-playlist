// todo doing this in sync slows us down? (exists, mkdir, copyfile)
prepareDir = () => fs.existsSync('downloads') || fs.mkdirSync('downloads');

downloadStream = stream => {
	let errorHandler = error => {
		console.log('3rr', error);
		console.log('video not downloaded', video.id, video.title);
		video.status = 'failed to download';
		promise.reject();
	};

	try {
		let writeStream = new MemoryWriteStream();
		stream.pipe(writeStream);

		video.status = 'preparing download';
		let sizeFormat = size => `${(size / 1024 / 1024).toFixed(2)} MB`;
		let timeFormat = time => `${time.toFixed(2)} seconds`;
		let startTime;

		stream.once('response', () => {
			startTime = Date.now();
			video.status = 'beginning download';
		});

		// todo handling error
		stream.on('error', errorHandler);

		stream.on('progress', (chunkLength, downloaded, total) => {
			let floatDownloaded = downloaded / total;
			let secondsPassed = (Date.now() - startTime) / 1000;

			let percent = `${(floatDownloaded * 100).toFixed(2)}%`;
			let size = `${sizeFormat(total)}`;
			let time = `${timeFormat(secondsPassed / floatDownloaded - secondsPassed)} remaining`;

			video.status = `${percent} (${time}) [${size}]`;
		});

		stream.on('end', () => {
			let secondsPassed = (Date.now() - startTime) / 1000;
			let time = `${timeFormat(secondsPassed)}`;
			video.status = `done downloading (${time})`;
			writeStream.writeToFile(`downloads/${video.id}.webm`);
			promise.resolve();
		});

	} catch (error) {
		errorHandler(error);
	}
};

module.exports = {prepareDir, downloadStream};
