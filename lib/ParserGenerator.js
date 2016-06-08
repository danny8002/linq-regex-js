"use strict";

var libData = require("./ParseData");
var libErrorData = require("./ParseErrorData");

exports = module.exports;

var MAX_TRACE_SOURCE_LENGTH = 100;

function _PASSTHROUGH(r) { return r; }

function _stringify(source) {
    return source == null ? "" : String(source);
}

/**
 * Initialize ParserGenerator object
 * @constructor
 * @param {Object} options Parser context
 * @param {ParseErrorData[]} options.history container to hold parser failure results
 * @param {Object} [options.trace] trace options to track parse process
 * @param {boolean} [options.trace.ignoreWhitespace] do not track whitespace parser (true by default)
 * @param {number} [options.trace.sourceMaxLength] max source length in TraceToken (100 by default)
 * @param {TraceToken[]} [options.trace.tokens] trace token container
 */
exports.ParserGenerator = function ParserGenerator(options) {
    if (options == null) throw new TypeError("argument {history, trace?} must be provided");
    this._history = options.history || [];
    this._traceOptions = undefined;

    if (!Array.isArray(this._history)) {
        throw new TypeError("[history] must be an array but get " + typeof this._history);
    }

    if (options.trace != null && options.trace.tokens != null) {
        this._traceOptions = {
            ignoreWhitespace: option.trace.ignoreWhitespace,
            sourceMaxLength: option.trace.sourceMaxLength,
            tokens: option.trace.tokens,
        };
        var trace = this._traceOptions;
        if (!Array.isArray(trace.tokens)) {
            throw new TypeError("[trace].[tokens] must be null/undefined or an array but get " + typeof trace.tokens);
        }

        trace.ignoreWhitespace = Boolean(trace.ignoreWhitespace);
        var num = Number(trace.sourceMaxLength);
        trace.sourceMaxLength = isNaN(num) ? MAX_TRACE_SOURCE_LENGTH : num;
    }
}

/**
 * Generate an regex parser
 * @param {string} pattern regex pattern
 * @param {string} description description about this regex
 * @returns {Parser<string>} a parser object
 *//**
* Generate an regex parser
* @param {string} pattern regex pattern
* @param {string} description description about this regex
* @param {Func<string,T>} map a map function
* @returns {Parser<T>} a parser object
*/
ParserGenerator.prototype.regex = function (pattern, description, mapFn) {
    if (typeof pattern !== 'string') {
        throw new TypeError("[pattern] must be a string but get [" + pattern + "]");
    }

    if (typeof description !== 'string') {
        throw new TypeError("[description] must be a string but get [" + description + "]");
    }

    if (arguments.length === 2) {
        mapFn = _PASSTHROUGH;
    }

    if (typeof mapFn !== 'function') {
        throw new TypeError("[map] must be a function but get [" + typeof mapFn + "]");
    }

    var self = this;
    // TODO: here add default flag?
    var regex = new RegExp("^" + pattern);

    return function parser(source) {
        var str = _stringify(source);
        var match = regex.exec(str);

        var success = match != null;
        var length = success ? match[0].length : 0;
        self._traceStep(success, length, description, pattern, str);

        if (success) {
            var rest = str.substr(length);
            return new libData.ParseData(mapFn(match[1]), rest);
        }

        return new libData.ParseData(new libErrorData.RegexParseErrorData(str.length, pattern, description));
    }
}

ParserGenerator.prototype._traceStep = function (success, length, description, pattern, source) {
    if (this._traceOptions != null) {
        if (this._traceOptions.ignoreWhitespace && description === "Whitespace") return;

        var max = this._traceOptions.sourceMaxLength;

        var token = {
            success: success,
            pattern: pattern,
            description: description,
            length: length,
            source: source.length > max ? source.substr(0, max) : source
        }

        this._traceOptions.tokens.push(token);
    }
}