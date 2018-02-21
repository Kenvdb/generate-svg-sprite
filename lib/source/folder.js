"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _fs = require("fs");

var fs = _interopRequire(_fs);

var _import = require("../util");

var u = _interopRequireWildcard(_import);

var _parse = require("../parser");

var parse = _interopRequire(_parse);

var _Promise = require("es6-promise");

module.exports = function (folderPath) {
    return function () {
        return new _Promise.Promise(function (res, rej) {
            var q = u.fileNameToObjectQueue(res);
            fs.readdir(folderPath, function (err, files) {

                if (err) {
                    return rej(err);
                }

                files.filter(function (f) {
                    // only take svg
                    return /\.svg/.test(f);
                }).forEach(function (f) {
                    q.push({
                        file: folderPath + "/" + f
                    });
                });
            });
        }).then(parse);
    };
};

;