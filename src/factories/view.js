app.factory('view', [function () {
    const view = {
        visual: true,
        canvas: document.querySelector('#fft'),
        canvasPreRender: document.createElement('canvas'),
        canvasCtx: null,
        canvasPreRenderCtx: null,
        width: 0,
        height: 0,
        nbBars: 0,
        nbLines: 0,
        barWidth: 0,
        barHorizOffset: 0,
        lineHeight: 0,
        barArraySize: 0,
        maxFrequencyDisplayed: 2000
    };
    view.canvasCtx = view.canvas.getContext('2d', {
        antialias: false,
        alpha: false
    });
    view.canvasPreRenderCtx = view.canvasPreRender.getContext('2d', {
        antialias: false,
        alpha: false
    });
    view.canvasCtx.imageSmoothingEnabled = false;
    view.canvasPreRenderCtx.imageSmoothingEnabled = false;
    return view;
}]);