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


    it("advanced parser - many - without map", function () {
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


    it("advanced parser - many - return empty array", function () {
        var source = "a1234stop";

        var parser = lib.Parser.many(digitParser);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.rest, source);
        assert_.strictEqual(obj.result.length, 0);
    })
})

describe("AdvancedParser-any-tests", function () {

    var digitParser;
    var alphaParser;

    before("new Parser", function () {
        var gen = new lib.ParserGenerator({ history: [] });
        digitParser = gen.regex("(\\d)", "digit");
        alphaParser = gen.regex("(\[a-z\])", "alpha");
    })

    it("advanced parser - any - with map", function () {
        var source = "abcdef";

        var parser = lib.Parser.any(digitParser, function map1(d) {
            return "map1";
        }, alphaParser, function map2(d) {
            return "map2";
        });

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result, "map2");
    })


    it("advanced parser - all - without map", function () {

        var source = "abcdef";

        var parser = lib.Parser.any(digitParser, alphaParser);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result, "a");
        assert_.equal(obj.rest, source.substr(1));
    })
})

describe("AdvancedParser-oneOrMore-tests", function () {

    var alphaParser;

    before("new Parser", function () {
        var gen = new lib.ParserGenerator({ history: [] });
        alphaParser = gen.regex("(\[a-z\])", "alpha");
    })

    it("advanced parser - oneOrMore - with map", function () {
        var source = "abcdef";

        var parser = lib.Parser.oneOrMore(alphaParser, function map(ds) {
            return ds.join("");
        });

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        // return array of alpha
        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result, "abcdef");

        var s2 = "0abc";
        var obj2 = parser(s2);

        // parse failure
        assert_.equal(obj2.isValid(), false);

        var s3 = "a09";
        var obj3 = parser(s3);

        // one alpha
        assert_.equal(obj3.isValid(), true);
        assert_.strictEqual(obj3.result, "a");
    })


    it("advanced parser - oneOrMore - without map", function () {
        var source = "abcdef";

        var parser = lib.Parser.oneOrMore(alphaParser);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        // return array of alpha
        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result.length, source.length);

        var s2 = "0abc";
        var obj2 = parser(s2);

        // parse failure
        assert_.equal(obj2.isValid(), false);

        var s3 = "a09";
        var obj3 = parser(s3);

        // one alpha
        assert_.equal(obj3.isValid(), true);
        assert_.strictEqual(Array.isArray(obj3.result), true);
        assert_.strictEqual(obj3.result[0], "a");
    })
})


describe("AdvancedParser-optional-tests", function () {

    var alphaParser;

    before("new Parser", function () {
        var gen = new lib.ParserGenerator({ history: [] });
        alphaParser = gen.regex("(\[a-z\])", "alpha");
    })

    it("advanced parser - optional", function () {
        var defaultValue = "defaultValue";
        var source = "abcdef";

        var parser = lib.Parser.optional(alphaParser, defaultValue);

        assert_.equal(libUtil.isParser(parser), true);

        var obj = parser(source);

        // found match
        assert_.equal(obj instanceof lib.ParseData, true);
        assert_.equal(obj.isValid(), true);
        assert_.equal(obj.result, "a");

        var s2 = "0abc";
        var obj2 = parser(s2);

        // no match
        assert_.equal(obj2.isValid(), true);
        assert_.strictEqual(obj2.result, defaultValue);
        assert_.strictEqual(obj2.rest, s2);
    })
})