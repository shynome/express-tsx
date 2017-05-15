define(["require", "exports", "react", "./deep1"], function (require, exports, React, deep2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (props) {
        return React.createElement("div", { onClick: function () { return alert(props.who); } }, JSON.stringify(deep2));
    };
});
