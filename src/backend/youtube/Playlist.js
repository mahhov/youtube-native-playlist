const axios = require('axios');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
const $tream = require('bs-better-stream');
const Video = require('./Video');

class Playlist {
	constructor(id) {
		this.id = id;
		this.pageCache = {};
		this.title = this.title_();
		this.length_().each(length => this.length = length);
	}

	getVideos() {
		let pages = $tream();
		let responses = pages
			.map(getPage)
			.wait();
		responses
			.pluck('nextPageToken')
			.filter(nextPage => nextPage);
		// .to(pages);
		pages.write();
		return responses
			.pluck('items')
			.flatten()
			.pluck('snippet')
			.map(snippet => new Video(
				snippet.resourceId.videoId,
				snippet.title,
				snippet.thumbnails && snippet.thumbnails.default.url));
	}

	title_() {
		return 'todo';
	}

	length_() {
		let firstPage = $tream();
		firstPage.writePromise(this.getPage_());
		return firstPage.pluck('pageInfo').pluck('totalResults');
	}

	getPage_(page = '') {
		return this.pageCache[page] = this.pageCache[page] ||
			axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${this.id}&key=${apiKey}`)
				.then(response => response.data)
	}
}

module.exports = Playlist;
