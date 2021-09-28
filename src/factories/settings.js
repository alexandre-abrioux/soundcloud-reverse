const app = require("../app");

app.factory("settings", [
    function () {
        let settings = {
            volume: 50,
            nbBarsMax: 255,
            nbLinesMax: 50,
            fftShow: true,
            fftEnlarge: true,
            smoothing: 40,
            accent: 40,
            selectedPlaylistID: null,
        };
        if (localStorage.getItem("settings") !== null) {
            const localSettings = JSON.parse(localStorage.getItem("settings"));
            angular.extend(settings, localSettings);
        }
        return settings;
    },
]);
