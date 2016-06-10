"use strict";

var libData = require("./lib/ParseData");
var libErrorData = require("./lib/ParseErrorData");
var libGen = require("./lib/ParserGenerator");
var libParser = require("./lib/Parser");

exports = module.exports;

function merge(a, b) {
    for (var k in b) {
        if (b.hasOwnProperty(k)) {
            a[k] = b[k];
        }
    }
}

merge(exports, libData);
merge(exports, libErrorData);
merge(exports, libGen);
merge(exports, libParser);
