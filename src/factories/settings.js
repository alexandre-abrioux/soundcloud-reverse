app.factory('settings', [function () {
    let settings = {
        volume: 50,
        nbBarsMax: 0,
        nbLinesMax: 12,
        fftShow:true,
        fftEnlarge: false,
        fftBehind: false,
        smoothing: 50,
        accent: 0,
        selectedPlaylistID: null
    };
    if (localStorage.getItem('settings') !== null) {
        const localSettings = JSON.parse(localStorage.getItem('settings'));
        angular.extend(settings, localSettings);
    }
    return settings;
}]);