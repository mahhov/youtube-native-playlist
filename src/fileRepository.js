const fs = require('fs');
const path = require('path');
const promiseCreator = require('./promiseCreator');

let readDir = dir => {
    let promiseWrap = promiseCreator();
    fs.readdir(dir, (err, list) => {
        err ? promiseWrap.reject(err) : promiseWrap.resolve(list);
    });
    return promiseWrap.promise;
};

let isDir = (dir, file) => {
    let promiseWrap = promiseCreator();
    let filePath = getPath(dir, file);
    fs.stat(filePath, function (err, stat) {
        err ? promiseWrap.reject(err) : promiseWrap.resolve(stat && stat.isDirectory());
    });
    return promiseWrap.promise;
};

let getPath = (dir, file) =>
    path.resolve(dir, file);

module.exports = {readDir, isDir, getPath};
