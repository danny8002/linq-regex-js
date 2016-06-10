"use strict";


var libData = require("./ParseData");
var libErrorData = require("./ParseErrorData");
var libGen = require("./ParserGenerator");
var libUtil = require("./Util");

exports = module.exports;

function isMap(fn) {
    return typeof fn === 'function';
}

function isParserMapPair(parser, map) {
    return libUtil.isParser(parser) && isMap(map);
}

function _toString(a) {
    return Object.prototype.toString.apply(a);
}

function _checkAllParserArguments(args) {
    var array = Array.prototype.slice.apply(args);
    var parsers = [];
    for (var i = 0; i < array.length; ++i) {
        var fn = array[i];
        if (typeof fn !== 'function') {
            throw new TypeError("Args[" + i + "] is not a function [" + _toString(fn) + "]");
        }
    }

    return array;
}

function _checkArgugment(name, fn) {
    if (typeof fn !== 'function') throw new TypeError("Argument [" + name + "] is not a function [" + _toString(fn) + "]");
}

/**
 * Union all parsers and map result
 * @memberof Parser
 * @static
 * @param {Parser<T1>} parser1 the first parser
 * @param {Parser<T2>} parser2 the second parser
 * @param {Parser<TN>} parserN the n-th parser
 * @param {function} map (T1,T2,...,TN) => R
 * @returns {Parser<R>} 
 *//**
* Union all parsers (without map) and put result in an array
* @memberof Parser
* @static
* @param {Parser<T1>} parser1 the first parser
* @param {Parser<T2>} parser2 the second parser
* @param {Parser<TN>} parserN the n-th parser
* @returns {Parser<T12N>} a parser that will return array, TypeOf(array[0])=T1, TypeOf(array[1])=T2, ... TypeOf(array[N-1])=TN
*/
function all() {
    var array = Array.prototype.slice.apply(arguments);
    var length = array.length;
    if (length <= 0) {
        throw new Error("At least one parser must be provided!");
    }

    var last = array[array.length - 1];
    var lastIsParser = libUtil.isParser(last);
    var lastIsMap = typeof last === 'function';

    // only map
    if (length == 1 && lastIsMap) {
        throw new TypeError("At least one parser must be provided!");
    }

    // last must be map or parser
    if (!lastIsMap && !lastIsParser) {
        throw new TypeError("The last argument must be parser or map but get [" + _toString(last) + "]");
    }

    // except last, all are parsers
    for (var i = 0; i < length - 1; ++i) {
        if (libUtil.isParser(array[i])) {
            throw new TypeError("Argument [parser" + (i + 1) + "] is not a valid parser [" + _toString(array[i]) + "]");
        }
    }

    var parsers = lastIsMap ? array.slice(0, length - 1) : array;

    return libUtil.makeParser(function allParser(source) {
        var str = source;
        var rs = new Array(parsers.length);
        for (var i = 0; i < parsers.length; ++i) {
            var parser = parsers[i];
            var r = parser(str);
            if (!r.isValid()) return new libData.ParseData(r.error);
            rs[i] = r.result;
            str = r.rest;
        }

        // (parser1,parser2,parser3, ..., parserN, map)
        if (lastIsMap) {
            return map.apply(null, rs);
        }
        // (parser1, parser2, parser3, ...)
        return new libData.ParseData(rs, str);
    });
}

/**
 * Match one of parsers and map result
 * @memberof Parser
 * @static
 * @param {Parser.<T1>} parser1 a parser
 * @param {Func1.<T1, R>} map1 a map function
 * @param {Parser.<T2>} parser2 a parser
 * @param {Func1.<T1, R>} map2 a map function
 * @param {Parser.<TN>} parserN n-th parser
 * @param {Func1.<TN, R>} mapN n-th map function
 * @returns {Parser<R>}
 *//**
* Match one of parsers (without map)
* @memberof Parser
* @static
* @param {Parser<T1>} parser1 the first parser
* @param {Parser<T2>} parser2 the second parser
* @param {Parser<TN>} parserN the n-th parser
* @returns {Parser<Ti>} the used parser
*/
function any() {
    var array = Array.prototype.slice.apply(arguments);
    var length = array.length;

    if (length <= 0) {
        throw new Error("At least one parser must be provided!");
    }

    var parsers = [];
    var maps = [];

    // (parser, map) pairs
    if (length % 2 === 0 && array.every(function (v_, i_, a_) {
        return i_ % 2 !== 0 || isParserMapPair(v_, a_[i_ + 1]);
    })) {
        array.forEach(function (v_, i_) { i_ % 2 === 0 ? parsers.push(v_) : maps.push(v_) });
    }
    else if (array.every(libUtil.isParser)) {
        // (parser1, parser2, parser3, ... )
        parsers = array;
    }
    else {
        throw new Error("Arguments must be (parser, map) pair or parsers");
    }

    return libData.makeParser(function anyParser(source) {
        var rs = new Array(parsers.length);
        for (var i = 0; i < parsers.length; ++i) {
            var parser = parsers[i];
            var map = maps[i];

            var r = parser(source);
            if (r.isValid()) {
                if (map == null) return r;
                return new libData.ParseData(map(r.result), r.rest);
            }

            rs.push(r);
        }

        var errors = rs.filter(function (v_) {
            return !(v_.error instanceof libErrorData.NoParseErrorData)
        });

        return new libData.ParseData(new libErrorData.AggregateParseErrorData(source.length, errors));
    });
}

/**
 * Use parser parse string as many as possible
 * @memberof Parser
 * @static
 * @param {Parser<T>} parser
 * @param {function} map (T[])=>R
 * @returns {Parser<R>}
 */
function many(parser, map) {
    if (!libUtil.isParser(parser)) {
        throw new TypeError("The first argument [parser] must be a parser but get [" + _toString(parser) + "]");
    }

    if (map != null && (typeof map !== 'function')) {
        throw new TypeError("The second argument [map] must be a function but get [" + _toString(map) + "]");
    }

    return libUtil.makeParser(function manyParser(source) {
        var str = source;
        var rs = [];
        do {
            var r = parser(str);
            if (!r.isValid()) {
                var mapR = rs.map(function (t) { return t.result; });
                if (map != null) mapR = map(mapR);
                return new libData.ParseData(mapR, str);
            }
            rs.push(r);
            str = r.rest;
        } while (true);
    });
}

/**
 * Optional parser
 * @memberof Parser
 * @static
 * @param {Parser<T>} parser
 * @param {T} defaultValue default value with type = T
 */
function optional(parser, defaultValue) {
    if (!libUtil.isParser(parser)) {
        throw new TypeError("[parser] is not a valid parser!");
    }

    return libUtil.makeParser(function optionalParser(source) {
        var r = parser(source);
        if (r.isValid()) return r;
        return new libData.ParseData(defaultValue, source);
    });
}

function oneOrMore(parser, map) {
    if (!libUtil.isParser(parser)) {
        throw new TypeError("The first argument [parser] must be a parser but get [" + _toString(parser) + "]");
    }

    if (map != null && !isMap(map)) {
        throw new TypeError("The second argument [map] must be a function but get [" + _toString(map) + "]");
    }

    return libUtil.makeParser(function oneOrMoreParser(source) {
        var r1 = parser(source);
        if (!r1.isValid()) return new libData.ParseData(r1.error);

        var rs = [r1];
        var str = r1.rest;
        while (true) {
            var r = parser(str);
            if (!r.isValid()) break;
            rs.push(r);
            str = r.rest;
        }

        var mapR = rs;
        if (map != null) mapR = map(rs);

        return new libData.ParseData(mapR, str);
    });
}

/**
 * Contains a lot of usfull advanced parser operator
 * @namespace
 */
exports.Parser = {
    "all": all,
    "any": any,
    "many": many,
    "oneOrMore": oneOrMore,
    "optional": optional
}