
var assert_ = require("assert");
var mocha_ = require("mocha");

var libData = require("../lib/ParseData");
var libErrorData = require("../lib/ParseErrorData");
var libGen = require("../lib/ParserGenerator");
var libUtil = require("../lib/Util");

function TestClass(k) {
    this.key = k;
}
function KVClass(k, v) {
    this.key = k;
    this.value = v;
}

describe("ParserGenerator-Regex-tests", function () {
    var gen;
    var options;
    var strParser;
    var strParserDescription;
    var mapParser;

    before("New ParserGenerator", function () {
        options = { history: [] }
        gen = new libGen.ParserGenerator(options);

        strParserDescription = "string parser description";
        strParser = gen.regex("([0-9a-zA-Z]+)", strParserDescription);
        mapParser = gen.regex("([0-9a-zA-Z]+)", "parser with map", function (k) { return new TestClass(k); });
    });

    it("Regex-Parser is valid parser", function () {
        assert_.equal(libUtil.isParser(strParser), true);
        assert_.equal(libUtil.isParser(mapParser), true);
    })

    it("Gen-Regex-Parser argument [pattern] must be string", function () {
        assert_.throws(function () {
            gen.regex({}, "invalid regex");
        }, function (err) {
            if ((err instanceof TypeError) && /string/.test(err.message)) {
                return true;
            }
            console.log("error: " + JSON.stringify(err));
        }, "Unexpected error");
    });

    it("Gen-Regex-Parser argument [pattern] must be a valid regex string", function () {
        assert_.throws(function () {
            gen.regex("[", "invalid regex");
        }, function (err) {
            if (err instanceof SyntaxError) {
                return true;
            }
            console.log("error: " + JSON.stringify(err));
        }, "Unexpected error");
    })

    it("Gen-Regex-Parser argument [description] must be string", function () {
        assert_.throws(function () {
            gen.regex("abc", { "a": "not a string" });
        }, function (err) {
            if (err instanceof TypeError) {
                return true;
            }
            console.log("error: " + JSON.stringify(err));
        }, "Unexpected error");
    })

    it("Gen-Regex-Parser argument [map] not a valid map", function () {
        var invalidMapFun = null;
        assert_.throws(function () {
            gen.regex("abc", "invalid regex", invalidMapFun);
        }, function (err) {
            if (err instanceof TypeError) {
                return true;
            }
        }, "Unexpected error");
    })

    it("Regex-Parser parse non-string", function () {

        var invalidSource = { "a": "non string" };

        assert_.throws(function () {
            var r = strParser(invalidSource);
        }, function (err) {
            if ((err instanceof Error) && /not a string/.test(err.message)) {
                return true;
            }
        }, "Unexpected error");
    })

    it("Regex-Parser parse string", function () {

        var source = "key =value";
        var r = strParser(source);

        assert_.equal(true, r instanceof libData.ParseData);
        assert_.strictEqual("key", r.result);
        assert_.strictEqual(" =value", r.rest);
        assert_.strictEqual(true, r.isValid());
        assert_.strictEqual(true, r.error == null);
    });


    it("Regex-Parser parse string with map", function () {

        var source = "key =value";
        var r = mapParser(source);

        assert_.equal(true, r instanceof libData.ParseData);
        assert_.strictEqual(true, r.result instanceof TestClass);
        assert_.strictEqual(r.result.key, "key");
        assert_.strictEqual(" =value", r.rest);
        assert_.strictEqual(true, r.isValid());
        assert_.strictEqual(true, r.error == null);
    });

    it("In principle Regex-Parser parse string from start", function () {
        var source = "?key =value";
        var r = strParser(source);

        assert_.equal(true, r instanceof libData.ParseData);
        assert_.strictEqual(false, r.isValid());
        assert_.strictEqual(true, r.error != null);

        var error = r.error;
        assert_.equal(true, error instanceof libErrorData.RegexParseErrorData);
        assert_.equal(strParserDescription, error.description)
    });
})

describe("ParserGenerator-parseUntil-argument-tests", function () {
    var gen;
    var options;

    before("New ParserGenerator", function () {
        options = { history: [] }
        gen = new libGen.ParserGenerator(options);
    });

    it("parseUntil argument need at least one token", function () {
        assert_.equal(typeof gen.parseUntil, "function");

        assert_.throws(function () {
            var p = gen.parseUntil();
        }, function (err) {
            if (err instanceof TypeError) {
                return true;
            }
            console.log(JSON.stringify(err));
        }, "Unexpected error");
    })


    it("parseUntil argument need separate string tokens (refuse string token array)", function () {
        assert_.equal(typeof gen.parseUntil, "function");

        assert_.throws(function () {
            var p = gen.parseUntil(["abc", "fn"]);
        }, function (err) {
            if ((err instanceof TypeError) && /string/.test(err.message)) {
                return true;
            }
            console.log(JSON.stringify(err));
        }, "Unexpected error");
    })

    it("parseUntil argument need string tokens", function () {
        assert_.equal(typeof gen.parseUntil, "function");

        assert_.throws(function () {
            var p = gen.parseUntil("abc", "fn", {});
        }, function (err) {
            if (err instanceof TypeError) {
                return true;
            }
            console.log(JSON.stringify(err));
        }, "Unexpected error");
    })

    it("parseUntil argument need non-empty string tokens", function () {
        assert_.equal(typeof gen.parseUntil, "function");

        assert_.throws(function () {
            var p = gen.parseUntil("abc", "", "fn");
        }, function (err) {
            if ((err instanceof TypeError) && /empty/i.test(err.message)) {
                return true;
            }
            console.log(JSON.stringify(err));
        }, "Unexpected error");
    })
})

describe("ParserGenerator-parseUntil-tests", function () {
    var gen;
    var options;
    var parser;

    before("New ParserGenerator", function () {
        options = { history: [] }
        gen = new libGen.ParserGenerator(options);
        parser = gen.parseUntil("fn", "fa");
    });

    it("empty source", function () {
        var r = parser("abcdefg");
        assert_.equal(r instanceof libData.ParseData, true);
        assert_.strictEqual(r.isValid(), true);
        assert_.notEqual(r.error instanceof libErrorData.ParseErrorData, true);
    })

    // TODO: think about this
    // it("no token match in source", function () {
    //     var r = parser("abcdefg");
    //     assert_.equal(r instanceof libData.ParseData, true);
    //     assert_.strictEqual(r.isValid(), true);
    //     assert_.notEqual(r.error instanceof libErrorData.ParseErrorData, true);
    // })

    it("reach to token in source", function () {
        var r = parser("abcdefafn");
        assert_.equal(r instanceof libData.ParseData, true);
        assert_.strictEqual(r.isValid(), true);
        assert_.strictEqual(r.result, "abcde");
        assert_.strictEqual(r.rest, "fafn");
    })
})

describe("ParserGenerator-static-parser-tests", function () {

    it("true parser - rest string = input source, result === true", function () {
        var parser = libGen.ParserGenerator.true();
        assert_.equal(libUtil.isParser(parser), true);

        var source = "source string";
        var r = parser(source);

        assert_.equal(r instanceof libData.ParseData, true);
        assert_.equal(r.isValid(), true);
        assert_.strictEqual(r.result, true);
        assert_.strictEqual(r.rest, source);
    })

    it("false parser return NoParseErrorData object", function () {
        var parser = libGen.ParserGenerator.false();
        assert_.equal(libUtil.isParser(parser), true);

        var source = "source string";
        var r = parser(source);

        assert_.equal(r instanceof libData.ParseData, true);
        assert_.equal(r.isValid(), false);
        assert_.equal(r.error instanceof libErrorData.NoParseErrorData, true);
    })

    it("empty parser - rest string = input source, result == null", function () {
        var parser = libGen.ParserGenerator.empty();
        assert_.equal(libUtil.isParser(parser), true);

        var source = "source string";
        var r = parser(source);

        assert_.equal(r instanceof libData.ParseData, true);
        assert_.equal(r.isValid(), true);
        assert_.equal(r.result, null);
        assert_.strictEqual(r.rest, source);
    })
})