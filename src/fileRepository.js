const fs = require('fs');
const path = require('path');
const PromiseCreator = require('./PromiseCreator');

let readDir = dir => {
	let promise = new PromiseCreator();
	fs.readdir(dir, (err, list) => {
		err ? promise.reject(err) : promise.resolve(list);
	});
	return promise.promise;
};

let isDir = (dir, file) => {
	let promise = new PromiseCreator();
	let filePath = getPath(dir, file);
	fs.stat(filePath, function (err, stat) {
		err ? promise.reject(err) : promise.resolve(stat && stat.isDirectory());
	});
	return promise.promise;
};

let getPath = (dir, file) =>
	path.resolve(dir, file);

module.exports = {readDir, isDir, getPath};
