var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "react", "./App"], function (require, exports, React, App_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (props) {
        return React.createElement(App_1.App, __assign({}, props),
            "hello ",
            props.who);
    };
});
//# sourceMappingURL=staticHTMLRender.js.map