"use strict";

/**
 * Initialize Parser object
 * @constructor
 * @param {Object} [options] Parser context
 * @param {Array.<ParseErrorData>} [options.history] container to hold parser failure results
 * @param {Array.<string>} [options.trace] container to trace parse step 
 */
function Parser(options) {
    this._options = options || {};
    this._options.history = this._options.history || [];
    this._options.trace = this._options.trace;
}

Parser.prototype.regex = function(pattern,description, ){

}

Parser.prototype._traceStep = function (str) {
    if (this._options.trace) { this._options.trace.push(str); }
}