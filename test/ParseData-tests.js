var assert_ = require("assert");
var mocha_ = require("mocha");

var lib = require("../lib/ParseErrorData");

describe("ParseErrorData-tests", function () {
    it("RegexParseErrorData inherits from ParserErrorData", function () {

        var result = new lib.RegexParseErrorData(5, "", "whitespace");
        assert_.equal(true, result instanceof lib.ParserErrorData);
    })

    it("NoParseErrorData inherits from ParserErrorData", function () {
        var result = new lib.NoParseErrorData();
        assert_.equal(true, result instanceof lib.ParserErrorData);
    })
})
