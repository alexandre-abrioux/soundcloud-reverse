const app = require("../app");

app.factory("view", [
    function () {
        const view = {
            loginCurrentState: null,
            visual: true,
            canvas: document.querySelector("#fft"),
            canvasPreRender: document.createElement("canvas"),
            canvasWave: document.querySelector("#controls-wave"),
            canvasCtx: null,
            canvasPreRenderCtx: null,
            canvasWaveCtx: null,
            width: 0,
            height: 0,
            nbBars: 0,
            nbLines: 0,
            barWidth: 0,
            barHorizOffset: 0,
            lineHeight: 0,
            barArraySize: 0,
            maxFrequencyDisplayed: 2000,
        };
        view.canvasCtx = view.canvas.getContext("2d", {
            antialias: false,
            alpha: false,
        });
        view.canvasPreRenderCtx = view.canvasPreRender.getContext("2d", {
            antialias: false,
            alpha: false,
        });
        view.canvasWaveCtx = view.canvasWave.getContext("2d", {
            antialias: false,
        });
        view.canvasCtx.imageSmoothingEnabled = false;
        view.canvasPreRenderCtx.imageSmoothingEnabled = false;
        view.canvasWaveCtx.imageSmoothingEnabled = false;
        return view;
    },
]);
