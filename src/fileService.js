const $tream = require('bs-better-stream');
const fileRepo = require('./fileRepository');

let walk = dir => {
    let dirs = $tream();

    dirs.write(dir);

    let readsIfDir = dirs
        .wrap('dir')
        .set('files', ({dir}) => fileRepo.readDir(dir))
        .waitOn('files')
        .flattenOn('files', 'file')
        .set('isDir', ({dir, file}) => fileRepo.isDir(dir, file))
        .waitOn('isDir')
        .if(({isDir}) => isDir);

    readsIfDir.then
        .map(({dir, file}) => fileRepo.getPath(dir, file))
        .to(dirs);

    return readsIfDir.else
        .pluck('file');
};

module.exports = {walk};
