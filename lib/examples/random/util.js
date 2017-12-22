define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KEY_CODES = {
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        SHIFT: 16,
        Q: 81,
        E: 69,
        G: 71
    };
    function paramString(name, defaultValue) {
        var queryMatch = document.location.href.match(new RegExp(name + "=([^&]+)"));
        if (queryMatch) {
            return (queryMatch[1]);
        }
        else {
            return defaultValue;
        }
    }
    exports.paramString = paramString;
    function paramInt(name, defaultValue) {
        return parseInt(paramString(name, defaultValue + ""));
    }
    exports.paramInt = paramInt;
    function paramFloat(name, defaultValue) {
        return parseFloat(paramString(name, defaultValue + ""));
    }
    exports.paramFloat = paramFloat;
    function varying() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return values[Math.round(Math.random() * (values.length - 1))];
    }
    exports.varying = varying;
});
//# sourceMappingURL=util.js.map