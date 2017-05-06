define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = function (props) {
        return React.createElement("html", { lang: "en" },
            React.createElement("head", null,
                React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
                React.createElement("meta", { "http-equiv": "X-UA-Compatible", content: "ie=edge" }),
                React.createElement("title", null, props.title)),
            React.createElement("body", null, props.children));
    };
});
