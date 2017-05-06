define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function () {
        return React.createElement("h1", { onClick: function () { return console.log('hello'); } }, "hello");
    };
});
