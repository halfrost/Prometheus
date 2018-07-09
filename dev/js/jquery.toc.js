(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * get header level
     * @param {String} header: header's tag name
     *
     * @return {Number}
     */
    var getLevel = function (header) {
        if (typeof header !== 'string') {
            return 0;
        }

        var decs = header.match(/\d/g);
        return decs ? Math.min.apply(null, decs) : 1;
    };

    /**
     * create ordered list
     * @param {jQuert} $wrapper
     * @param {Number} count
     *
     * @return {jQuery} list
     */
    var createList = function ($wrapper, count) {
        while (count--) {
            $wrapper = $('<ol/>').appendTo($wrapper);

            if (count) {
                $wrapper = $('<li/>').appendTo($wrapper);
            }
        }

        return $wrapper;
    };

    /**
     * insert position jump back
     * @param {jQuery} $currentWrapper: current insert point
     * @param {Number} offset: distance between current's and target's depth
     *
     * @return {jQuery} insert point
     */
    var jumpBack = function ($currentWrapper, offset) {
        while (offset--) {
            $currentWrapper = $currentWrapper.parent();
        }

        return $currentWrapper;
    };

    /**
     * set element href/id and content
     * @param {Boolean} overwrite: whether overwrite source element existed id
     * @param {String} prefix: prefix to prepend to href/id
     *
     * @return {Function}
     */
    var setAttrs = function (overwrite, prefix) {
        return function ($src, $target, index) {
            var content = $src.text();
            var pre = prefix + '-' + index;
            $target.text(content);

            var src = $src[0];
            var target = $target[0];
            var id = overwrite ? pre : (src.id || pre);

            id = encodeURIComponent(id);

            src.id = id;
            target.href = '#' + id;
        };
    };

    /**
     * build table of contents
     * @param {Object} options
     *
     * @return {jQuery} list
     */
    var buildTOC = function (options) {
        var selector = options.selector;
        var scope = options.scope;

        var $ret = $('<ol/>');
        var $wrapper = $ret;
        var $lastLi = null;

        var prevDepth = getLevel(selector);
        var _setAttrs = setAttrs(options.overwrite, options.prefix);

        $(scope)
            .find(selector)
            .each(function (index, elem) {
                var currentDepth = getLevel(elem.tagName);
                var offset = currentDepth - prevDepth;

                if (offset > 0) {
                    $wrapper = createList($lastLi, offset);
                }

                if (offset < 0) {
                    // should be once more level to jump back
                    // eg: h2 + h3 + h2, offset = h2 - h3 = -1
                    //
                    // ol <------+ target
                    //   li      |
                    //     ol ---+ current
                    //       li
                    //
                    // jumpback = target - current = 2
                    $wrapper = jumpBack($wrapper, -offset * 2);
                }

                if (!$wrapper.length) {
                    $wrapper = $ret;
                }

                var $li = $('<li/>');
                var $a = $('<a/>');

                _setAttrs($(elem), $a, index);

                $li.append($a).appendTo($wrapper);

                $lastLi = $li;
                prevDepth = currentDepth;
            });

        return $ret;
    };

    /**
     * init table of contents
     * @param {Object} [option]: TOC options, available props:
     *                              {String} [selector]: headers selector, default is 'h1, h2, h3, h4, h5, h6'
     *                              {String} [scope]: selector to specify elements search scope, default is 'body'
     *                              {Boolean} [overwrite]: whether to overwrite existed headers' id, default is false
     *                              {String} [prefix]: string to prepend to id/href prop, default is 'toc'
     *
     * @return {jQuery} $this
     */
    $.fn.initTOC = function (options) {
        var defaultOpts = {
            selector: 'h1, h2, h3, h4, h5, h6',
            scope: 'body',
            overwrite: false,
            prefix: 'toc'
        };

        options = $.extend(defaultOpts, options);

        var selector = options.selector;

        if (typeof selector !== 'string') {
            throw new TypeError('selector must be a string');
        }

        if (!selector.match(/^(?:h[1-6],?\s*)+$/g)) {
            throw new TypeError('selector must contains only h1-6');
        }

        $(this).append(buildTOC(options));

        var currentHash = location.hash;

        if (currentHash) {
            setTimeout(function () {
                var anchor = document.getElementById(currentHash.slice(1));
                if (anchor) anchor.scrollIntoView();
            }, 0);
        }

        return $(this);
    };
}));
