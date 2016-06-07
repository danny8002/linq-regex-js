'use strict';
var fs_ = require("fs");
var path_ = require("path");

function tsc2Grunt(tsConfig) {
    var tscOptions = tsConfig.compilerOptions;

    // convert outDir option to Grunt-ts style options
    var gruntTSC = { options: tscOptions };
    if (tscOptions.outDir != null) {
        gruntTSC.files = {};
        gruntTSC.files[tscOptions.outDir] = tsConfig.files;
    } else {
        gruntTSC.src = tsConfig.files;
    }

    return gruntTSC;
}

module.exports = function (grunt) {

    grunt.log.debug('Read tsconfig.json from current project directory!');
    var tsConfig = grunt.file.readJSON('tsconfig.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: tsc2Grunt(tsConfig)
        },

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