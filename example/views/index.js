define("App", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.App = function (_a) {
        var _b = _a.lang, lang = _b === void 0 ? 'zh-hms-cn' : _b, _c = _a.title, title = _c === void 0 ? 'title' : _c, _d = _a.children, children = _d === void 0 ? [] : _d;
        return React.createElement("html", { lang: lang },
            React.createElement("head", null,
                React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
                React.createElement("meta", { "http-equiv": "X-UA-Compatible", content: "ie=edge" }),
                React.createElement("title", null, title)),
            React.createElement("body", null, children));
    };
});
define("index", ["require", "exports", "App"], function (require, exports, App_1) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = function (props) {
        return React.createElement(App_1.App, null,
            React.createElement("h1", { onClick: console.log.bind(console) }, "hello"));
    };
});
