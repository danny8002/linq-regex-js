'use strict';
var fs_ = require("fs");
var path_ = require("path");

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                    timeout: 100000
                },
                src: ['test/**/*.js']
            }
        },


        //jsdoc config
        jsdoc: {
            dist: {
                src: [
                    "README.md",
                    "lib/ParseData.js"
                ],
                options: {
                    destination: 'docs',
                    configure: 'jsdoc/jsdoc.json'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask("default", ["ts:default"]);
    grunt.registerTask("doc", ["jsdoc"])
    grunt.registerTask("build", ["ts:default", "mochaTest:test"]);
}