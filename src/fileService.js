const $tream = require('bs-better-stream');
const fileRepo = require('./fileRepository');

let walk = dir => {
    let dirs = $tream();

    dirs.write(dir);

    let reads = dirs
        .map(dir =>
            fileRepo.readDir(dir).then(files => ({dir, files})))
        .wait()
        .flatMap(({dir, files}) => {
            return files.map(file => ({dir, file}));
        });

    let readsIfDir = reads
        .map(({dir, file}) =>
            fileRepo.isDir(dir, file).then(isDir => ({dir, file, isDir})))
        .wait()
        .if(({dir, file, isDir}) => isDir);

    readsIfDir.then
        .map(({dir, file, isDir}) => fileRepo.getPath(dir, file))
        .to(dirs);

    return readsIfDir.else
        .pluck('file');
};

module.exports = {walk};
