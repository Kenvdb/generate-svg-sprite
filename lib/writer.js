'use strict';

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _fs = require('fs');

var fs = _interopRequire(_fs);

var _Promise = require('es6-promise');

var writeToFile = function writeToFile(destPath, content) {
    return new _Promise.Promise(function (res, rej) {
        fs.writeFile(destPath, content, function (err) {
            if (err) {
                rej(err);
            } else {
                res(destPath);
            }
        });
    });
};

var getSpriteXml = function getSpriteXml(svgs, color) {
    var xml = '';

    xml += '<?xml version="1.0" encoding="utf-8"?>' + '\n' + '<svg xmlns="http://www.w3.org/2000/svg">' + '\n\n' + '<defs>' + '<style><![CDATA[' + ' .icon { display: none; }' + ' .icon:target { display: inline; }' + (color ? ' svg path { fill: ' + color + ' }' : '') + ' ]]></style>' + '</defs>' + '\n\n' + svgs.map(function (s) {
        if (typeof s === 'object' && typeof s.content !== 'undefined') {
            var string = '',
                size = s.viewBox.split(' '),
                content = s.content;

            if (typeof color !== 'undefined') {
                content = content.replace(/<style[^\0]*?<\/style>/g, '');
                content = content.replace(/fill="(.*?)"\s/g, '');
            }

            content = content.replace(/<title>(.*?)<\/title>/g, '');
            content = content.replace(/^\s+|\s+$/g, '');

            string += '<svg xmlns="http://www.w3.org/2000/svg"' + (s.viewBox ? ' viewBox="0 0 ' + size[2] + ' ' + size[3] + '"' : '') + ' x="0px" y="0px"' + '>' + '\n';

            string += '<g' + (s.id ? ' id="' + s.id + '"' : '') + (s.viewBox ? ' viewBox="' + s.viewBox + '"' : '') + ' class="icon">' + content + '</g>' + '\n';

            string += '</svg>' + '\n\n';

            return string;
        }
    }).join('\n\n') + '</svg>' + '\n';

    return xml;
};

var publicWriteToFile = function publicWriteToFile(filePath, svgs, color) {
    return writeToFile(filePath, getSpriteXml(svgs, color));
};

var publicWriteToConsole = function publicWriteToConsole(svgs) {
    return new _Promise.Promise(function () {
        console.log(getSpriteXml(svgs));
    });
};

exports.getSpriteXml = getSpriteXml;
exports.writeToFile = publicWriteToFile;
exports.writeToConsole = publicWriteToConsole;