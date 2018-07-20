const ls = window.localStorage;

let get = key =>
	ls.getItem(key);

let set = (key, value) =>
	ls.setItem(key, value);

let getObj = key =>
	JSON.parse(ls.getItem(key));

let setObj = (key, value) =>
	ls.setItem(key, JSON.stringify(value));

module.exports = {get, set, getObj, setObj};
