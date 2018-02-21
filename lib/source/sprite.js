"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _fs = require("fs");

var fs = _interopRequire(_fs);

var _cheerio = require("cheerio");

var cheerio = _interopRequire(_cheerio);

var _import = require("../util");

var u = _interopRequireWildcard(_import);

var _parse = require("../parser");

var parse = _interopRequire(_parse);

var _Promise = require("es6-promise");

module.exports = function (file) {
    return function () {
        return new _Promise.Promise(function (res, rej) {
            fs.readFile(file, function (err, data) {
                if (err) {
                    return rej(err);
                }

                // data
                var q = cheerio.load(data.toString("utf8"), {
                    xmlMode: true
                });

                var symbols = q("symbol");

                if (symbols.length == 0) {
                    return res([]);
                }

                var eles = [];
                symbols.each(function (index, ele) {
                    var t = q(this);
                    eles.push({
                        id: t.attr("id"),
                        viewBox: t.attr("viewBox"),
                        content: t.html()
                    });
                });
                res(eles);
            });
        });
    };
};

;