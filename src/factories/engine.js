app.factory('engine', [
    'settings',
    'sc-params',
    function (settings, scParams) {
        const engine = {
            player: new SoundCloudAudio(scParams.client_id),
            audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
            audioSrc: null,
            frequencyData: null,
            frequencyDataCopy: null,
            maxFrequencyInArray: 0,
            nbValuesToKeepInArray: 0
        };
        engine.player.audio.crossOrigin = "anonymous";
        engine.analyser = engine.audioCtx.createAnalyser();
        engine.analyser.fftSize = Math.pow(2, 15);
        engine.analyser.minDecibels = -70;
        engine.analyser.maxDecibels = -10;
        engine.analyser.smoothingTimeConstant = settings.smoothing / 100;
        engine.gainNode = engine.audioCtx.createGain();
        engine.gainNode.connect(engine.audioCtx.destination);
        return engine;
    }]);