/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

// This class was copied from https://github.com/antonmedv/codejar/blob/3.7.0/linenumbers.ts
function withLineNumbers(highlight, options) {
    if (options === void 0) { options = {}; }
    var opts = __assign({ class: "codejar-linenumbers", wrapClass: "codejar-wrap", width: "35px", backgroundColor: "rgba(128, 128, 128, 0.15)", color: "" }, options);
    var lineNumbers;
    return function (editor) {
        highlight(editor);
        if (!lineNumbers) {
            lineNumbers = init(editor, opts);
            editor.addEventListener("scroll", function () { return lineNumbers.style.top = "-" + editor.scrollTop + "px"; });
        }
        var code = editor.textContent || "";
        var linesCount = code.replace(/\n$/g, "").split("\n").length;
        var text = "";
        for (var i = 0; i < linesCount; i++) {
            text += i + 1 + "\n";
        }
        lineNumbers.innerText = text;
    };
}
function init(editor, opts) {
    var css = getComputedStyle(editor);
    var wrap = document.createElement("div");
    wrap.className = opts.wrapClass;
    wrap.style.position = "relative";
    var innerWrap = document.createElement("div");
    innerWrap.className = "codejar-linenumbers-inner-wrap";
    innerWrap.style.background = css.background;
    innerWrap.style.marginTop = css.borderTopWidth;
    innerWrap.style.marginBottom = css.borderBottomWidth;
    innerWrap.style.marginLeft = css.borderLeftWidth;
    innerWrap.style.borderTopLeftRadius = css.borderTopLeftRadius;
    innerWrap.style.borderBottomLeftRadius = css.borderBottomLeftRadius;
    var gutter = document.createElement("div");
    gutter.className = opts.class;
    innerWrap.appendChild(gutter);
    wrap.appendChild(innerWrap);
    // Add own styles
    gutter.style.width = opts.width;
    gutter.style.overflow = "hidden";
    gutter.style.backgroundColor = opts.backgroundColor;
    // Copy editor styles
    gutter.style.fontFamily = css.fontFamily;
    gutter.style.fontSize = css.fontSize;
    gutter.style.lineHeight = css.lineHeight;
    gutter.style.paddingTop = "calc(" + css.paddingTop + ")";
    gutter.style.paddingLeft = css.paddingLeft;
    gutter.style.borderTopLeftRadius = css.borderTopLeftRadius;
    gutter.style.borderBottomLeftRadius = css.borderBottomLeftRadius;
    // Add line numbers
    var lineNumbers = document.createElement("div");
    lineNumbers.setAttribute("class", "codejar-linenumber");
    lineNumbers.style.color = opts.color || css.color;
    lineNumbers.style.setProperty("mix-blend-mode", "unset");
    gutter.appendChild(lineNumbers);
    // Tweak editor styles
    editor.style.paddingLeft = "calc(" + opts.width + " + " + gutter.style.paddingLeft + " + 5px)";
    editor.style.whiteSpace = "pre";
    // Swap editor with a wrap
    editor.parentNode.insertBefore(wrap, editor);
    wrap.appendChild(editor);
    return lineNumbers;
}

export { withLineNumbers };
