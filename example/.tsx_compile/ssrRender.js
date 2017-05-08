define(["require", "exports", "react", "./deep1"], function (require, exports, React, deep) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log(deep);
    exports.default = function (props) {
        return React.createElement("div", { onClick: function () { return alert(props.who); } },
            "hello ",
            props.who,
            "84848",
            React.createElement("span", { style: { color: 'red' } }, "ddddddddddddd"));
    };
});
