var assert_ = require("assert");
var mocha_ = require("mocha");

var libUtil = require("../lib/Util");
var lib = require("../index");

function KVClass(k, v) {
    this.key = k;
    this.value = v;
}

describe("AdvancedParser-all-tests", function () {

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

    it("advanced parser - all - with map", function () {
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


    it("advanced parser - all - without map", function () {
        var source = "name=Microsoft dummy";

        var parser = lib.Parser.all(keyParser, sepParser, valueParser);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.strictEqual(obj.result[0], "name");
        assert_.strictEqual(obj.result[1], undefined);
        assert_.strictEqual(obj.result[2], "Microsoft");
    })
})


describe("AdvancedParser-many-tests", function () {

    var digitParser;

    before("new Parser", function () {
        var gen = new lib.ParserGenerator({ history: [] });
        digitParser = gen.regex("(\\d)", "digit");
    })

    it("advanced parser - many - with map", function () {
        var source = "1234stop";

        var parser = lib.Parser.many(digitParser, function map(digits) {
            return digits.join("");
        });

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result, "1234");
        assert_.equal(obj.rest, "stop");
    })


    it("advanced parser - all - without map", function () {
        var source = "1234stop";

        var parser = lib.Parser.many(digitParser);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.rest, "stop");
        assert_.strictEqual(obj.result[0], "1");
        assert_.strictEqual(obj.result[1], "2");
        assert_.strictEqual(obj.result[2], "3");
        assert_.strictEqual(obj.result[3], "4");
    })
})