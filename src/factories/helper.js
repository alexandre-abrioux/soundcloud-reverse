const app = require("../app");

app.factory("helper", [
    function () {
        return {
            normalize: function (val, maxOrigin, maxDest) {
                if (maxOrigin === 0) return 0;
                return Math.round((maxDest * val) / maxOrigin);
            },
            resizeCanvasKeepContent: function (_canvas, _context, w, h) {
                const temp_cnvs = window.document.createElement("canvas");
                const temp_cntx = temp_cnvs.getContext("2d");
                temp_cnvs.width = w;
                temp_cnvs.height = h;
                temp_cntx.drawImage(_canvas, 0, 0, w, h);
                _canvas.width = w;
                _canvas.height = h;
                _context.drawImage(temp_cnvs, 0, 0);
            },
            findByID: function (id) {
                return function (element) {
                    return element.id === id;
                };
            },
            logScale: function (options) {
                options = options || {};
                const scale = {
                    minval: options.minval || 0,
                    maxval: options.maxval || 100,
                    minlval: options.minlval || 1,
                    maxlval: options.maxlval || 100,
                };
                scale.minlval = Math.log(scale.minlval);
                scale.maxlval = Math.log(scale.maxlval);
                scale.scale =
                    scale.maxval - scale.minval === 0
                        ? 0
                        : (scale.maxlval - scale.minlval) /
                          (scale.maxval - scale.minval);
                scale.valueToLog = function (value) {
                    return Math.exp(
                        (value - scale.minval) * scale.scale + scale.minlval
                    );
                };
                scale.logToValue = function (log) {
                    return (
                        scale.minval +
                        (Math.log(log) - scale.minlval) / scale.scale
                    );
                };
                return scale;
            },
        };
    },
]);
