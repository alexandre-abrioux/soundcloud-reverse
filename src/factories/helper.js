app.factory('helper', [function () {
    return {
        normalize: function (val, maxOrigin, maxDest) {
            return Math.round(maxDest * val / maxOrigin);
        },
        resizeCanvasKeepContent: function (_canvas, _context, w, h) {
            const temp_cnvs = window.document.createElement('canvas');
            const temp_cntx = temp_cnvs.getContext('2d');
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
            }
        }
    }
}]);