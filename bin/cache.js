"use strict";

var cache = {};

function exists(key) {
    return cache.hasOwnProperty(key);
}

function del(key) {
    if (exists(key)) {
        delete cache[key];
        return true;
    }
    return false;
}

function get(key) {

    if (exists(key)) {
        return cache[key];
    }

    return false;
}

function set(key, value) {
    var expires = arguments[2] === undefined ? 1000 * 60 * 5 : arguments[2];

    if (!exists(key)) {

        cache[key] = value;

        setTimeout(function () {
            del(key);
        }, expires);
    } else {
        return false;
    }

    return true;
}

module.exports = {
    get: get,
    exists: exists,
    set: set
};