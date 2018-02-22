"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _import = require("./writer");

var writer = _interopRequireWildcard(_import);

var _srcList = require("./source/list");

var srcList = _interopRequire(_srcList);

var _srcCsv = require("./source/csv");

var srcCsv = _interopRequire(_srcCsv);

var _srcFolder = require("./source/folder");

var srcFolder = _interopRequire(_srcFolder);

var _srcSprite = require("./source/sprite");

var srcSprite = _interopRequire(_srcSprite);

var _program = require("commander");

var program = _interopRequire(_program);

var _async = require("async");

var async = _interopRequire(_async);

module.exports = function () {
    program.version("1.1.4").option("-c --color <color>", "Color of sprite icons").option("-d --directory <directory>", "SVG folder").option("-e --excel <csv>", "CSV file path").option("-l --list <list>", "List of files").option("-o --output <output>", "Out put to file").option("-s --sprite <sprite>", "Another sprite file").parse(process.argv);

    var fnList = ["sprite", "csv", "directory", "list"].filter(function (i) {
        return !!program[i];
    }).map(function (i) {
        switch (i) {
            case "sprite":
                return srcSprite(program.sprite);
            case "excel":
                return srcCsv(program.excel);
            case "directory":
                return srcFolder(program.directory);
            case "list":
                return srcList(program.list.split(",").map(function (i) {
                    return i.trim();
                }));
        }
    });

    // process them all
    async.map(fnList, function (fn, callback) {
        fn().then(function (objects) {
            callback(false, objects);
        }, function (error) {
            callback(true, error);
        });
    }, function (err, results) {
        if (results.length === 0) {
            return;
        }
        // reduces the results into one
        var svgs = results.reduce(function (prev, curr) {
            return prev.concat(curr);
        }, []);

        if (program.output) {
            writer.writeToFile(program.output, svgs, program.color || undefined);
        } else {
            writer.writeToConsole(svgs);
        }
    });
};

;