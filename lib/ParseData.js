"use strict";

var lib = require("./ParserErrorData");

/**
 * Represent parse result object
 * @constructor
 * @param {any} result parse result
 * @param {string} rest the rest string
 * @throws Error
 */
function ParseData(arg1, arg2) {
    this.result = undefined; // any
    this.rest = undefined; // string
    this.error = undefined; // ParserErrorData

    if (arguments.length === 2 && typeof arg2 === 'string') {
        this.result = arg1;
        this.rest = arg2;
    }
    else if (arguments.length === 1 && (arg1 instanceof lib.ParserErrorData)) {
        this.error = arg1;
    }
    else {
        throw new Error("Invalid argument for " + ParseData.prototype.name);
    }
}

ParseData.prototype.isValid = function () {
    return this.error == null;
}