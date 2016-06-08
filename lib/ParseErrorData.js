"use strict";

/**
 * 
 * @constructor
 * @param {number} position where parser fails
 */
function ParserErrorData(position) {
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
function RegexParseErrorData(position, pattern, description) {
    ParserErrorData.apply(this, arguments);
    this.pattern = pattern;
    this.description = description;
}

RegexParseErrorData.prototype = new ParserErrorData();
RegexParseErrorData.prototype.constructor = RegexParseErrorData;

module.exports.ParserErrorData = ParserErrorData;
module.exports.RegexParseErrorData = RegexParseErrorData;