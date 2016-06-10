var assert_ = require("assert");
var mocha_ = require("mocha");

var lib = require("../index");

describe("Package-tests", function () {
    it("Exposed Symbols", function () {
        assert_.equal(typeof lib.ParseData, "function");
        assert_.equal(typeof lib.ParseErrorData, "function");
        assert_.equal(typeof lib.NoParseErrorData, "function");
        assert_.equal(typeof lib.RegexParseErrorData, "function");
        assert_.equal(typeof lib.PrematureEndParseErrorData, "function");
        assert_.equal(typeof lib.AggregateParseErrorData, "function");


        assert_.equal(typeof lib.ParserGenerator, "function");
        assert_.equal(typeof lib.ParserGenerator.false, "function");
        assert_.equal(typeof lib.ParserGenerator.true, "function");
        assert_.equal(typeof lib.ParserGenerator.empty, "function");

        assert_.equal(typeof lib.Parser, "object");
        assert_.equal(typeof lib.Parser.all, "function");
        assert_.equal(typeof lib.Parser.any, "function");
        assert_.equal(typeof lib.Parser.many, "function");
        assert_.equal(typeof lib.Parser.oneOrMore, "function");
        assert_.equal(typeof lib.Parser.optional, "function");
    });
})