const axios = require('axios');
const apiUrl = 'https://www.googleapis.com/models/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
const $tream = require('bs-better-stream');
const Video = require('./Video');

class Playlist {
	constructor(id) {
		this.id = id;
		this.pageCache = {};
		this.setOverview_();
	}

	setOverview_() {
		this.getOverview_().then(overview => {
			let playlist = overview.items[0];
			if (!playlist) {
				this.title = '-- no playlist with this id --'; // todo use dedicated error message
				return;
			}
			this.title = playlist.snippet.title;
			this.length = playlist.contentDetails.itemCount;
		});
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

	getOverview_() {
		return this.overviewCache = this.overviewCache ||
			axios.get(`${apiUrl}/playlists?part=snippet,contentDetails&id=${this.id}&key=${apiKey}`)
				.then(response => response.data)
	}

	getPage_(page = '') {
		return this.pageCache[page] = this.pageCache[page] ||
			axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${this.id}&key=${apiKey}`)
				.then(response => response.data)
	}
}

module.exports = Playlist;
