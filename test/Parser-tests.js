var assert_ = require("assert");
var mocha_ = require("mocha");

var libUtil = require("../lib/Util");
var lib = require("../index");

function KVClass(k, v) {
    this.key = k;
    this.value = v;
}

describe("Parser-tests", function () {

    var keyParser;
    var sepParser;
    var valueParser;
    var valueParserDesc;

    before("new Parser", function () {
        var gen = new lib.ParserGenerator({ history: [] });
        valueParserDesc = "value extractor regex";

        keyParser = gen.regex("([0-9a-zA-Z]+)", "key extractor regex");
        sepParser = gen.regex("=")
        valueParser = gen.regex("(\[\\S\]+)", valueParserDesc);
    })

    it("advanced parser - all", function () {
        var source = "name=Microsoft dummy";

        var KVClassParser = lib.Parser.all(keyParser, sepParser, valueParser, function map(k, _1, v) {
            return new KVClass(k, v);
        });

        assert_.equal(libUtil.isParser(KVClassParser), true);

        var obj = KVClassParser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result.key, "name");
        assert_.equal(obj.result.value, "Microsoft");
        assert_.equal(obj.rest, " dummy");

        var failureSource = "name= Microsoft dummy";
        var failureObj = KVClassParser(failureSource);

        // failed in parsing value because whitespace before "Microsoft"
        assert_.equal(failureObj.isValid(), false);
        assert_.equal(failureObj.error.description, valueParserDesc);

    })
})