var assert_ = require("assert");
var mocha_ = require("mocha");

var lib = require("../lib/ParseErrorData");

describe("ParseErrorData-tests", function () {
    it("ParserErrorData inherits from RegexParseErrorData", function () {

        var result = new lib.RegexParseErrorData(5, "", "whitespace");
        assert_.equal(true, result instanceof lib.ParserErrorData);

    })
})
