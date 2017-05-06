define(["require", "exports", "react", "./index"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (props) {
        return React.createElement("div", { onClick: function () { return alert(props.who); } },
            "hello ",
            props.who,
            "84848",
            React.createElement("span", { style: { color: 'red' } }, "ddddddddddddd"));
    };
});
