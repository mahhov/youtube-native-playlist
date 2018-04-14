module.exports = () => {
    let resolve, reject;
    let promise = new Promise((resolv, rejec) => {
        resolve = resolv;
        reject = rejec;
    });
    return {promise, resolve, reject};
};
