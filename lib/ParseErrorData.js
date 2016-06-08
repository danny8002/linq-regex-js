"use strict";

exports = module.exports;

/**
 * 
 * @constructor
 * @param {number} position where parser fails
 */
exports.ParserErrorData = function ParserErrorData(position) {
    this.position = position;
}

/**
 * Represent Regex Parser failure data
 * @constructor
 * @extends ParserErrorData
 * @param {number} position where parser fails
 * @param {string} pattern regex pattern
 * @param {string} description about this regex pattern
 */
exports.RegexParseErrorData = function RegexParseErrorData(position, pattern, description) {
    ParserErrorData.apply(this, arguments);
    this.pattern = pattern;
    this.description = description;
}

RegexParseErrorData.prototype = new ParserErrorData();
RegexParseErrorData.prototype.constructor = RegexParseErrorData;

/**
 * Represent no Parser failure data
 * @constructor
 * @extends ParserErrorData
 */
exports.NoParseErrorData = function NoParseErrorData() {
    var args = [0];
    ParserErrorData.apply(this, args);
}

NoParseErrorData.prototype = new ParserErrorData();
NoParseErrorData.prototype.constructor = NoParseErrorData;
