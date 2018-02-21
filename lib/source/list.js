"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _import = require("../util");

var u = _interopRequireWildcard(_import);

var _parse = require("../parser");

var parse = _interopRequire(_parse);

var _Promise = require("es6-promise");

module.exports = function (list) {
    return function () {
        return new _Promise.Promise(function (res, rej) {
            var q = u.fileNameToObjectQueue(res);

            list.forEach(function (item) {
                q.push(typeof item === "object" ? item : {
                    file: item
                });
            });
        }).then(parse);
    };
};

;