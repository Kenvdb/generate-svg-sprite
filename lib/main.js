"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _import = require("./writer");

var writer = _interopRequireWildcard(_import);

var _srcList = require("./source/list");

var srcList = _interopRequire(_srcList);

var _parse = require("./parser");

var parse = _interopRequire(_parse);

var spriteFromFiles = function spriteFromFiles(files) {
    return new Promise(function (res, rej) {
        srcList(files)().then(function (results) {
            res(writer.getSpriteXml(results));
        });
    });
};

exports.spriteFromFiles = spriteFromFiles;