"use strict";

exports = module.exports;

var PARSER_IDENTIFY_KEY = "_isParser";

exports.makeParser = function (fn) {
    fn[PARSER_IDENTIFY_KEY] = true;
    return fn;
}

exports.isParser = function (fn) {
    return fn != null && fn[PARSER_IDENTIFY_KEY] === true && typeof fn === 'function';
}

exports.CONSTANT_VARS = {
    MAX_TRACE_SOURCE_LENGTH: 100
}

exports.passThrough = function (r) { return r; }

exports.ensureString = function (source) {
    var t = typeof source;
    if (t === 'string') return source;
    throw new TypeError("[source] is not a string!");
}

exports.isEmptyOrWhitespace = function (str) {
    return typeof str === 'string' && str.trim().length <= 0;
}

exports.min = function (arr) {
    var m = arr[0];
    for (var i = 1; i < arr.length; ++i) {
        if (arr[i] < m) m = arr[i];
    }
    return m;
}