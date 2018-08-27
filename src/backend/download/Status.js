const PromiseCreator = require('../../PromiseCreator');

class Status {
	constructor() {
		this.text = '';
		this.promise = new PromiseCreator();
	}

	onFail() {
		this.text = 'failed to download';
		this.promise.reject();
	}

	onStart() {
		this.startTime = Date.now();
		this.text = 'beginning download';
	}

	onProgress(downloadedSize, totalSize) {
		let floatDownloaded = downloadedSize / totalSize;
		let secondsPassed = this.secondsPassed_;
		let estimatedTimeRemaining = secondsPassed / floatDownloaded - secondsPassed;

		let percent = Status.percentFormat(floatDownloaded);
		let size = Status.sizeFormat(totalSize);
		let time = Status.timeFormat(estimatedTimeRemaining);

		video.status = `${percent} (${time} remaining) [${size}]`;
	}

	onSuccess() {
		let time = `${Status.timeFormat(this.secondsPassed_)}`;
		video.status = `done downloading (${time})`;
		writeStream.writeToFile(`downloads/${video.id}.webm`);
		promise.resolve();
	}

	get secondsPassed_() {
		return (Date.now() - this.startTime) / 1000;
	}

	static percentFormat(percent) {
		`${(percent * 100).toFixed(2)}%`;
	}

	static sizeFormat(size) {
		`${(size / 1024 / 1024).toFixed(2)} MB`;
	}

	static timeFormat(time) {
		`${time.toFixed(2)} seconds`;
	}
}

module.exports = Status;
