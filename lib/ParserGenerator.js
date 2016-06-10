"use strict";

var libData = require("./ParseData");
var libErrorData = require("./ParseErrorData");
var libUtil = require("./Util");

exports = module.exports;

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
function ParserGenerator(options) {
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
        trace.sourceMaxLength = isNaN(num) ? libUtil.CONSTANT_VARS.MAX_TRACE_SOURCE_LENGTH : num;
    }
}

/**
 * Generate an regex parser
 * @param {string} pattern regex pattern
 * @param {string} [description] description about this regex
 * @returns {Parser<string>} a parser object
 *//**
* Generate an regex parser
* @param {string} pattern regex pattern
* @param {string} description description about this regex
* @param {function} map (string) => R
* @returns {Parser<T>} a parser object
*/
ParserGenerator.prototype.regex = function (pattern, description, mapFn) {
    if (typeof pattern !== 'string') {
        throw new TypeError("[pattern] must be a string but get [" + pattern + "]");
    }

    if (description != null && typeof description !== 'string') {
        throw new TypeError("[description] must be a string but get [" + description + "]");
    }

    if (arguments.length === 1 || arguments.length === 2) {
        mapFn = libUtil.passThrough;
    }

    if (typeof mapFn !== 'function') {
        throw new TypeError("[map] must be a function but get [" + typeof mapFn + "]");
    }

    var self = this;
    // TODO: here add default flag?
    var regex = new RegExp("^" + pattern);

    return libUtil.makeParser(function regexParser(source) {
        var str = libUtil.ensureString(source);
        var match = regex.exec(str);

        var success = match != null;
        var length = success ? match[0].length : 0;
        self._traceStep(success, length, description, pattern, str);

        if (success) {
            var rest = str.substr(length);
            return new libData.ParseData(mapFn(match[1]), rest);
        }

        return new libData.ParseData(new libErrorData.RegexParseErrorData(str.length, pattern, description));
    });

}

/**
 * Reach to one of tokens
 * @param {...string[]} values tokens
 */
ParserGenerator.prototype.parseUntil = function () {

    var values = Array.prototype.slice.apply(arguments);
    if (values.length <= 0) {
        throw new TypeError("At least one string token must be provided!");
    }

    for (var i = 0; i < values.length; ++i) {
        if (typeof values[i] !== 'string') {
            throw new TypeError("Only string token is accepted but get " + JSON.stringify(values[i]));
        }
        if (values[i].length <= 0) {
            throw new TypeError("Empty string token is not allowed in " + JSON.stringify(values));
        }
    }

    var self = this;

    return libUtil.makeParser(function utilParser(source) {
        var src = libUtil.ensureString(source);

        if (src.length <= 0) {
            var error = new libErrorData.RegexParseErrorData(src.length, values.join("|"), "[built-in] until parser");
            return new libData.ParseData(error);
        }

        var indexes = [];
        var indexes = values.map(function (v) {
            return src.indexOf(v);
        });

        // TODO: think about this ?
        if (indexes.every(function (i) { return i < 0 })) {
            self._traceStep(true, src.length, "[built-in] until parser", values.join("|"), src);
            return new libData.ParseData(src, "");
        }

        var index = libUtil.min(indexes.filter(function (i) { return i >= 0; }));

        self._traceStep(true, index, "[built-in] until parser", values.join("|"), src);

        return new libData.ParseData(src.substr(0, index), src.substr(index));
    });
}

/**
 * Generate empty parser
 * @returns {Parser<T>} empty parser with result = null
 */
ParserGenerator.empty = function () {
    return libUtil.makeParser(function emptyParser(source) {
        var str = libUtil.ensureString(source);
        return new libData.ParseData(null, str);
    });
}

/**
 * Generate true parser
 * @static
 * @returns {Parser<T>} boolean parser with result = true
 */
ParserGenerator.true = function () {
    return libUtil.makeParser(function trueParser(source) {
        return new libData.ParseData(true, source);
    });
}

/**
 * Generate false parser
 * @static
 * @returns {Parser<T>} boolean parser with empty error
 */
ParserGenerator.false = function () {
    return libUtil.makeParser(function falseParser(source) {
        return new libData.ParseData(new libErrorData.NoParseErrorData());
    });
}

/**
 * Generate parser which check whether string reach to end
 * @returns {Parser<T>} 
 */
ParserGenerator.prototype.endOfFile = function () {
    return libUtil.makeParser(function endOfFileParser(source) {
        var str = libUtil.ensureString(source);
        return libUtil.isEmptyOrWhitespace(str)
            ? new libData.ParseData(str, "")
            : new libData.ParseData(new libErrorData.PrematureEndParseErrorData(str.length));
    });
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

exports.ParserGenerator = ParserGenerator;