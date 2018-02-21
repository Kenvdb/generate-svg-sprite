// copied from https://github.com/preciousforever/SVG-Stacker/blob/master/fixsvgstack.jquery.js
// modified to handle :before elements, only initialized for safari browsers and handle nested svg files...
(function ($) {

    // Setup
    // ----------
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // The fix is for safari browsers only....
    if (!isSafari) {
        // return functions that do nothing but support chaining
        $.fn.fixSVGStack = function () { return this; };
        $.fn.fixSVGStackBackground = function () { return this; };
        return;
    }

    // Enabled / disable support for a dirty CSS-Hack
    // if `USE_DIRTY_CSS_CONTENT_HACK` is true the following CSS enables the fix
    // – otherwise only inline styles can be fixed
    //
    // ```
    // .classname {
    //   background: transparent url('stack.svg#SVG') no-repeat top left;
    //   content: 'stack.svg#SVG'; /* use content to pass url to webkit fixSVGStackBackground */
    // }
    // ```
    //
    var USE_DIRTY_CSS_CONTENT_HACK = true;

    // The Fix
    // ----------

    // Caches XML of SVG Elements (less parsing)
    var cache = {};

    // Reads SVG Stack via Ajax and returns one element encoded data-uri.
    function getdataURIFromStack(url, cb) {
        if (url in cache) {
            cb(cache[url]);
        }

        var parts = url.split('#'); // `url` must be in the form filename.svg#id

        if (parts.length !== 2) {
            cb(false);
        }

        var processStack = function (xmlText) {
            var xml = (new window.DOMParser()).parseFromString(xmlText, "text/xml")
            var svg = xml.getElementById(parts[1]).parentNode; // `parts[1]` contains id
            var viewBoxData;

            if (svg == null) {
                cache[url] = false;
                cb(false);
            }

            // iOS Safari fix:
            // Firefox uses viewBox and can't scale SVGs when width and height
            // attributes are defined.
            // Safari on iOS needs width and height to scale properly
            var viewBox = svg.getAttribute('viewBox');
            if (viewBox && (viewBoxData = viewBox.split(' ')).length === 4) {
                svg.setAttribute('width', viewBoxData[2]);
                svg.setAttribute('height', viewBoxData[3]);
            }

            var svgString = (new XMLSerializer()).serializeToString(svg);
            var dataURI = 'data:image/svg+xml;utf-8,' + escape(svgString);

            cache[url] = dataURI;
            cb(dataURI);
        }

        // Ajax request, browser handles caching
        $.ajax({
            // `parts[0]` contains filename.svg
            url: parts[0],
            cache: true,
            // Read SVG as 'text', jQuerys XML Parsing is broken with SVGs
            dataType: 'text',
            success: processStack
        });
    }

    // Fix for SVG Stacks in background
    $.fn.fixSVGStackBackground = function () {
        this.each(function () {
            var $el = $(this);

            // At the heart of the bug:
            // Both jquery's `$el.css('background-image')` and `getComputedStyle($el[0], null).backgroundImage`
            // return and url without the #target part;
            var url = $el[0].style.backgroundImage.slice(4, (-1)).replace(/["']/g, '');

            // Here is the quick and dirty hack...
            if (USE_DIRTY_CSS_CONTENT_HACK && url.indexOf('.svg#') === -1) {
                var style = getComputedStyle($el[0], null), icon;

                // Element has no background image, try to fetch :before element...
                if (style.backgroundImage.indexOf('.svg') === -1) {
                    style = getComputedStyle($el[0], ':before');
                    icon = document.createElement("div");

                    var styles = '';
                    styles += 'display:' + style.getPropertyValue('display');
                    styles += ';background-image:' + style.getPropertyValue('background-image');
                    styles += ';background-position:' + style.getPropertyValue('background-position');
                    styles += ';background-repeat:' + style.getPropertyValue('background-repeat');
                    styles += ';background-size:' + style.getPropertyValue('background-size');
                    styles += ';position:' + style.getPropertyValue('position');
                    styles += ';width:' + style.getPropertyValue('width');
                    styles += ';height:' + style.getPropertyValue('height');
                    styles += ';left:' + style.getPropertyValue('left');
                    styles += ';top:' + style.getPropertyValue('top');
                    styles += ';transform' + style.getPropertyValue('transform');
                    styles += ';';

                    icon.style.cssText = styles;
                }

                // Read url form `style.content`,
                //  the css content property is used to transport the information
                if (style.backgroundImage.indexOf('.svg') !== -1) {
                    url = style.backgroundImage.slice(4, (-1));

                    // When content: '' has been set, use this value for the svg,
                    //  otherwise get the icon from the elements data-attribute...
                    if (style.content.indexOf('.svg#') !== -1) {
                        url = style.content.replace(/["']/g, '');
                    } else {
                        url += '#icon-' + $el.data('icon');
                    }
                }
            }

            if (url.indexOf('.svg#') === -1) {
                return;
            }

            getdataURIFromStack(url, function (dataURI) {
                if (dataURI === false) {
                    return;
                }

                if (typeof icon === 'object') {
                    icon.style.cssText += 'background-image:url(' + dataURI + ')';
                    $el.get(0).appendChild( icon )
                } else {
                    $el.css('background-image', 'url(' + dataURI + ')');
                }
            });
        });
        return this;
    };

    // Fix for SVG Stacks in img Tags
    $.fn.fixSVGStack = function () {
        this.each(function () {

            var $el = $(this);
            var url = $el.attr('src');

            if (url.indexOf('.svg#') === -1) {
                return;
            }
            getdataURIFromStack(url, function (dataURI) {
                if (dataURI === false) {
                    return;
                }
                // Replace src with dataURI
                $el.attr('src', dataURI);
            });
        });
        return this;
    };

})(jQuery);