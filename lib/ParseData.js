"use strict";

var lib = require("./ParserErrorData");

exports = module.exports;

/**
 * Represent parse result
 * @constructor
 * @param {any} result parse result
 * @param {string} rest the rest string
 * @throws Error if argument 
 * 
 *//**
* Represent parse result
* @constructor
* @param {ParserErrorData} error parse failure object
*/
exports.ParseData = function ParseData(arg1, arg2) {
    this.result = undefined; // any
    this.rest = undefined; // string
    this.error = undefined; // ParserErrorData

    var args = arguments;

    if (args.length === 2 && typeof arg2 === 'string') {
        this.result = arg1;
        this.rest = arg2;
    }
    else if (args.length === 1 && (arg1 instanceof lib.ParserErrorData)) {
        this.error = arg1;
    }
    else {
        var str = Array.prototype.join.call(args, ",")
        throw new Error("Argument error, length=" + args.length + ", args=[" + str + "]");
    }
}

/**
 * @returns {boolean} check whether it is successful parse result
 */
ParseData.prototype.isValid = function () {
    return this.error == null;
}