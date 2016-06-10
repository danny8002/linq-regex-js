var assert_ = require("assert");
var mocha_ = require("mocha");

var lib = require("../lib/ParseErrorData");

describe("ParseErrorData-tests", function () {
    it("RegexParseErrorData inherits from ParseErrorData", function () {

        var result = new lib.RegexParseErrorData(5, "", "whitespace");
        assert_.equal(true, result instanceof lib.ParseErrorData);
    });

    it("NoParseErrorData inherits from ParseErrorData", function () {
        var result = new lib.NoParseErrorData();
        assert_.equal(true, result instanceof lib.ParseErrorData);
    });

    it("AggregateParseErrorData inherits from ParseErrorData", function () {
        var error = new lib.RegexParseErrorData(0, "abcd", "dummy");
        var result = new lib.AggregateParseErrorData(0, [error]);

        assert_.equal(true, result instanceof lib.ParseErrorData);
    });

    it("PrematureEndParseErrorData inherits from ParseErrorData", function () {
        var result = new lib.PrematureEndParseErrorData(0);
        assert_.equal(true, result instanceof lib.ParseErrorData);
    });
})

