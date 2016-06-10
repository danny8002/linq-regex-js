"use strict";

exports = module.exports;

/**
 * 
 * @constructor
 * @param {number} position where parser fails
 */
function ParseErrorData(position) {
    this.position = position;
}

/**
 * Represent Regex Parser failure data
 * @constructor
 * @extends ParseErrorData
 * @param {number} position where parser fails
 * @param {string} pattern regex pattern
 * @param {string} description about this regex pattern
 */
function RegexParseErrorData(position, pattern, description) {
    ParseErrorData.apply(this, arguments);
    this.pattern = pattern;
    this.description = description;
}

RegexParseErrorData.prototype = new ParseErrorData();
RegexParseErrorData.prototype.constructor = RegexParseErrorData;

/**
 * Represent no Parser failure data
 * @constructor
 * @extends ParseErrorData
 */
function NoParseErrorData() {
    var args = [0];
    ParseErrorData.apply(this, args);
}

NoParseErrorData.prototype = new ParseErrorData();
NoParseErrorData.prototype.constructor = NoParseErrorData;


/**
 * Represent no Parser failure data
 * @constructor
 * @extends ParseErrorData
 * @param {number} position 
 */
function PrematureEndParseErrorData(position) {
    ParseErrorData.apply(this, arguments);
}

PrematureEndParseErrorData.prototype = new ParseErrorData();
PrematureEndParseErrorData.prototype.constructor = PrematureEndParseErrorData;


/**
 * Represent no Parser failure data
 * @constructor
 * @extends ParseErrorData
 * @param {number} position 
 * @param {ParseErrorData[]} errors 
 */
function AggregateParseErrorData(position, errors) {
    ParseErrorData.apply(this, arguments);
    this.parseErrors = Array.prototype.slice.apply(errors);
}

AggregateParseErrorData.prototype = new ParseErrorData();
AggregateParseErrorData.prototype.constructor = AggregateParseErrorData;


exports.ParseErrorData = ParseErrorData;
exports.NoParseErrorData = NoParseErrorData;
exports.RegexParseErrorData = RegexParseErrorData;
exports.PrematureEndParseErrorData = PrematureEndParseErrorData;
exports.AggregateParseErrorData = AggregateParseErrorData;
