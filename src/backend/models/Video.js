const fs = require('fs');
const ytdl = require('ytdl-core');
const $tream = require('bs-better-stream');
const PromiseCreator = require('../../PromiseCreator');
const MemoryWriteStream = require('../download/MemoryWriteStream');
const downloadService = require('../download/downloadService');

class Video {
	constructor(id, title, thumbnail) {
		this.id = id;
		this.title = title;
		this.thumbnail = thumbnail;
	}

	download() {
		downloadService.prepareDir();
		this.downloadStatus = downloadService.downloadStream(this.getStream_());
		return this.downloadStatus;
	}

	getStream_() {
		return this.streamCache = this.streamCache || ytdl(this.id, {quality: 'lowest'});
	}
}


module.exports = Video;
