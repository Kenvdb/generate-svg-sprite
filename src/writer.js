import {default as fs} from 'fs';
import {Promise} from "es6-promise";

let writeToFile = function (destPath, content) {
    return new Promise(function (res, rej) {
        fs.writeFile(destPath, content, function (err) {
            if (err) {
                rej(err);
            } else {
                res(destPath);
            }
        });
    });  
};

let getSpriteXml = function (svgs, color) {
    let xml = '';

    xml += '<?xml version="1.0" encoding="utf-8"?>' + "\n" +
        '<svg xmlns="http://www.w3.org/2000/svg">' + "\n\n" +
        '<defs>' +
        '<style><![CDATA[' +
        ' .icon { display: none; }' +
        ' .icon:target { display: inline; }' +
        (color ? (' svg path { fill: ' + color + ' }') : '') +
        ' ]]></style>' +
        '</defs>' + "\n\n" +

        svgs.map(function (s) {
            if (typeof s === 'object' && typeof s.content !== 'undefined') {
                let string = '',
                    size = s.viewBox.split(' '),
                    content = s.content;

                if (typeof color !== 'undefined') {
                    content = content.replace(/<style[^\0]*?<\/style>/g, '');
                }

                content = content.replace(/<title>(.*?)<\/title>/g, '');
                content = content.replace(/^\s+|\s+$/g, '');

                string += '<svg xmlns="http://www.w3.org/2000/svg"' +
                  (s.viewBox ? (' viewBox="0 0 ' + size[2] + ' ' + size[3] + '"') : '') +
                  ' x="0px" y="0px"' +
                  '>' + "\n";

                string += '<g' +
                  (s.id ? (' id="' + s.id + '"') : '') +
                  (s.viewBox ? (' viewBox="' + s.viewBox + '"') : '') +
                  ' class="icon">' +
                  content +
                  '</g>' + "\n";

                string += '</svg>' + "\n\n";

                return string;
            }

        }).join("\n\n") + '</svg>' + "\n";

    return xml;
};

let publicWriteToFile = function (filePath, svgs, color) {
    return writeToFile(filePath, getSpriteXml(svgs, color));
};

let publicWriteToConsole = function (svgs) {
    return new Promise(function () {
        console.log(getSpriteXml(svgs));
    });
};

export {getSpriteXml as getSpriteXml};
export {publicWriteToFile as writeToFile};
export {publicWriteToConsole as writeToConsole};

