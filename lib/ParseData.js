/**
 * 
 * @constructor
 * @param {number} position where parser fails
 */
function ParserErrorData(position) {
    this.position = position;
}

/**
 * Represent Regex Parser failure data, inherit from ParserErrorData
 * @constructor
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

/**
 * Represent parse result object
 * @constructor
 * @param {any} result parse result
 * @param {string} rest the rest string
 * //**
 * Represent parse result object
 * @constructor
 * @param {any} error parse result
 */
function ParseData(result, rest) {

}