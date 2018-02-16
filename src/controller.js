app.controller('MainCtrl', [
    '$scope',
    '$http',
    '$window',
    '$timeout',
    'sc-params',
    'sc-init',
    'helper',
    'settings',
    'view',
    'engine',
    function ($scope,
              $http,
              $window,
              $timeout,
              scParams,
              sc,
              helper,
              settings,
              view,
              engine) {
        $scope.$timeout = $timeout;
        $scope.ready = false;
        $scope.loginIn = false;
        $scope.playlists = [];
        $scope.paused = true;
        $scope.currentPlayingPlaylist = null;
        $scope.currentPlayingTrack = null;
        $scope.refreshing = false;
        $scope.helper = helper;
        $scope.settings = settings;
        $scope.engine = engine;
        $scope.view = view;

        /************************
         * PLAYER
         ***********************/
        $scope.play = function (playlist, track) {
            if (engine.player)
                engine.player.dispose();
            $scope.currentPlayingPlaylist = playlist;
            $scope.currentPlayingTrack = track;
            startRenderingWave();
            console.info('Track [', track.id, '] > queued', track);
            SC.stream('/tracks/' + track.id).then(function (player) {
                engine.player = player;
                engine.player.off();
                engine.player.on('state-change', playerEventListener);
                engine.player.play();
            });
        };
        $scope.resume = function () {
            if (engine.player)
                engine.player.play();
        };
        $scope.pause = function () {
            if (engine.player)
                engine.player.pause();
        };
        $scope.playNext = function () {
            // in case playlists have been refreshed and this playlist doesn't exist anymore
            if (typeof $scope.currentPlayingPlaylist === 'undefined') {
                $scope.currentPlayingPlaylist = null;
                $scope.currentPlayingTrack = null;
                $scope.$apply();
                return false;
            }
            const trackIndex = $scope.currentPlayingPlaylist.tracks.findIndex(helper.findByID($scope.currentPlayingTrack.id));
            let nextTrack;
            if (trackIndex < $scope.currentPlayingPlaylist.tracks.length - 1)
                nextTrack = $scope.currentPlayingPlaylist.tracks[trackIndex + 1];
            else
                nextTrack = $scope.currentPlayingPlaylist.tracks[0];
            $timeout(function () {
                $scope.play($scope.currentPlayingPlaylist, nextTrack);
            });
        };
        $scope.seek = function () {
            if (!engine.player)
                return;
            const position = helper.normalize(cursorPositionInWave(), view.canvasWave.width, engine.player.options.duration);
            engine.player.seek(position);
        };

        /************************
         * WATCHERS
         ***********************/
        $scope.$watch('settings', function (settings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        }, true);
        $scope.$watch('settings.volume', function (volume) {
            engine.gainNode.gain.value = volume / 100;
        });
        $scope.$watch('settings.smoothing', function (smoothing) {
            engine.analyser.smoothingTimeConstant = smoothing / 100;
        });
        $scope.$watch('settings.nbBarsMax', function () {
            computeFFTParameters();
        });
        $scope.$watch('settings.nbLinesMax', function () {
            computeFFTParameters();
        });
        $scope.$watch('settings.fftShow', function (fftShow, fftShowPrevious) {
            if (!fftShowPrevious && fftShow)
                startRendering();
        });
        $scope.$watch('settings.fftEnlarge', function (fftEnlarge) {
            if (!fftEnlarge)
                settings.fftBehind = false;
            $timeout(resize, 700);
        });

        /************************
         * CONNECT AND DISCONNECT
         ***********************/
        $scope.disconnect = function () {
            localStorage.clear();
            window.location.reload();
        };
        $scope.init = function (refresh) {
            refresh = typeof refresh === 'undefined' ? false : refresh;
            $scope.refreshing = refresh;
            $scope.loginIn = true;
            sc(scParams)
                .then(function (token) {
                    console.info('Soundcloud Token:', token);
                    $scope.loginIn = false;
                    if (!refresh && localStorage.getItem('souncloud.playlists') !== null)
                        return JSON.parse(localStorage.getItem('souncloud.playlists'));
                    return SC.get('/me/playlists')
                        .then(function (playlists) {
                            console.info('Loaded playlists from SoundCloud');
                            return playlists;
                        })
                        .then(function (playlists) {
                            // The track arrays returned by /me/playlists are ordered by track creation date.
                            // We retrieve the chronological order by fetching each playlist individually.
                            // We then reverse that order.
                            let promises = [];
                            for (let i = 0; i < playlists.length; i++)
                                promises.push(SC.get('/playlists/' + playlists[i].id).then(function (playlist) {
                                    console.info('Loaded playlist ' + playlists[i].id + ' details from SoundCloud (' + playlists[i].title + ')');
                                    playlists[i].tracks = playlist.tracks.reverse();
                                }));
                            return Promise.all(promises).then(function () {
                                return playlists;
                            });
                        })
                        .then(function (playlists) {
                            localStorage.setItem('souncloud.playlists', JSON.stringify(playlists));
                            return playlists;
                        });
                })
                .then(function (playlists) {
                    $scope.playlists = playlists;
                    if (!refresh && localStorage.getItem('souncloud.favorites') !== null)
                        return JSON.parse(localStorage.getItem('souncloud.favorites'));
                    return SC.get('/me/favorites').then(function (favorites) {
                        console.info('Loaded favorites from SoundCloud');
                        localStorage.setItem('souncloud.favorites', JSON.stringify(favorites));
                        return favorites;
                    });
                })
                .then(function (favorites) {
                    $scope.playlists.unshift({
                        title: 'Likes',
                        tracks: favorites
                    });
                    if (settings.selectedPlaylistID === null
                        || typeof $scope.playlists.find(helper.findByID(settings.selectedPlaylistID)) === 'undefined')
                        settings.selectedPlaylistID = $scope.playlists[0].id;
                    $scope.ready = true;
                    $scope.refreshing = false;
                    $scope.$apply();
                })
                .catch(function (error) {
                    console.error('Error', error);
                    if (
                        !$scope.ready
                        && localStorage.getItem('souncloud.token') !== null
                    )
                        $scope.disconnect();
                });
        };
        if (localStorage.getItem('souncloud.token') !== null)
            $scope.init();

        /************************
         * FFT RENDERING
         ***********************/
        let isRendering = false;
        const startRendering = function () {
            if (isRendering)
                return;
            isRendering = true;
            renderFrame();
        };
        const logScaleOneTo100 = helper.logScale();
        const renderFrame = function () {
            if (!settings.fftShow) {
                isRendering = false;
                return;
            }
            requestAnimationFrame(renderFrame);
            engine.analyser.getByteFrequencyData(engine.frequencyData);
            const frequencyDataTruncated = engine.frequencyData.subarray(0, engine.nbValuesToKeepInArray).map(function (value) {
                return value;
            });
            const frenquencyDataGrouped = new Uint8Array(view.nbBars);
            let maxAmp = 0;
            for (let i = 0; i < view.nbBars; i++) {
                const subArray = frequencyDataTruncated.subarray(view.barArraySize * i, view.barArraySize * (i + 1));
                frenquencyDataGrouped[i] = Math.max.apply(null, subArray);
                maxAmp = Math.max(frenquencyDataGrouped[i], maxAmp);
            }
            if (settings.accent > 0 && engine.frequencyDataCopy !== null)
                for (let i = 0; i < view.nbBars; i++) {
                    const slope = frenquencyDataGrouped[i] - engine.frequencyDataCopy[i];
                    if (slope > 0) {
                        frenquencyDataGrouped[i] += slope * logScaleOneTo100.valueToLog(settings.accent);
                        maxAmp = Math.max(frenquencyDataGrouped[i], maxAmp);
                    }
                }
            const logScaleOneTo55 = helper.logScale({maxval: maxAmp, minlval: 1, maxlval: 50});
            engine.frequencyDataCopy = frenquencyDataGrouped;
            view.canvasPreRenderCtx.drawImage(view.canvasPreRender, 0, view.lineHeight);
            for (let x = 0; x < view.nbBars; x++) {
                const color = 50 + helper.normalize(frenquencyDataGrouped[x], maxAmp, 150) + logScaleOneTo55.valueToLog(frenquencyDataGrouped[x]);
                view.canvasPreRenderCtx.fillStyle = 'rgb(' + color + ', 90, 150)';
                view.canvasPreRenderCtx.fillRect(x * view.barWidth * 3 / 2 + view.barHorizOffset, 0, view.barWidth, view.lineHeight);
            }
            view.canvasCtx.drawImage(view.canvasPreRender, 0, 0);
            view.canvasCtx.scale(1, -1);
            view.canvasCtx.drawImage(view.canvasPreRender, 0, -view.height);
            view.canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
        };

        /************************
         * WAVE RENDERING
         ***********************/
        $scope.renderWaveCursor = 0;
        const cursorPositionInWave = function () {
            let cursorX = $scope.renderWaveCursor - view.canvasWave.offsetLeft;
            cursorX -= document.querySelector('#controls-playback').offsetLeft;
            return cursorX;
        };
        let isRenderingWave = false;
        const startRenderingWave = function () {
            view.canvasWaveCtx.clearRect(0, 0, view.canvasWave.width, view.canvasWave.height);
            if (isRenderingWave || !$scope.currentPlayingTrack)
                return;
            const url = $scope.currentPlayingTrack.waveform_url;
            if (!$scope.currentPlayingTrack.waveform_data) {
                $http.get(url.replace(/\.png$/, '.json')).then(function (response) {
                    $scope.currentPlayingTrack.waveform_data = response.data;
                    startRenderingWave();
                });
                return;
            }
            isRenderingWave = true;
            renderWaveFrame();
        };
        const renderWaveFrame = function () {
            if (!$scope.currentPlayingTrack || !$scope.currentPlayingTrack.waveform_data || !engine.player) {
                isRenderingWave = false;
                return;
            }
            requestAnimationFrame(renderWaveFrame);
            const data = $scope.currentPlayingTrack.waveform_data;
            const barsSize = 2;
            const spaceSize = 1;
            const gapSize = barsSize + spaceSize;
            const nbBars = Math.floor(view.canvasWave.width / gapSize);
            const barArraySize = Math.floor(data.width / nbBars);
            const cursorX = helper.normalize(cursorPositionInWave(), view.canvasWave.width, nbBars);
            const currentTime = helper.normalize(engine.player.currentTime(), engine.player.options.duration, nbBars);
            view.canvasWaveCtx.clearRect(0, 0, view.canvasWave.width, view.canvasWave.height);
            for (let x = 0; x < nbBars; x++) {
                const subArray = data.samples.slice(barArraySize * x, barArraySize * (x + 1));
                const maxValue = Math.max.apply(null, subArray);
                const barHeight = Math.floor(view.canvasWave.height * maxValue / data.height);
                let fillStyle = 'rgba(150,150,150,';
                fillStyle = x < cursorX ? 'rgba(33,150,243,' : fillStyle;
                fillStyle = x < currentTime ? 'rgba(225,136,186,' : fillStyle;
                view.canvasWaveCtx.fillStyle = fillStyle + '1)';
                view.canvasWaveCtx.fillRect(x * gapSize, 2 * view.canvasWave.height / 3, barsSize, -barHeight * 2 / 3);
                view.canvasWaveCtx.fillStyle = fillStyle + '0.5)';
                view.canvasWaveCtx.fillRect(x * gapSize, 2 * view.canvasWave.height / 3 + spaceSize, barsSize, barHeight / 3);
            }
        };

        /************************
         * PLAYER EVENTS
         ***********************/
        const playerEventListener = function (e) {
            console.info('Track [', engine.player.options.soundId, '] >', e);
            $scope.paused = true;
            switch (e) {
                case 'loading':
                    if (engine.player.controller)
                        engine.player.controller._html5Audio.crossOrigin = "anonymous";
                    if (!$scope.$root.$$phase)
                        $scope.$apply();
                    break;
                case 'playing':
                    if (typeof engine.audioSrc === 'object' && engine.audioSrc !== null
                        && typeof engine.audioSrc.disconnect === 'function')
                        engine.audioSrc.disconnect();
                    engine.audioSrc = engine.audioCtx.createMediaElementSource(engine.player.controller._html5Audio);
                    engine.audioSrc.connect(engine.analyser);
                    engine.audioSrc.connect(engine.gainNode);
                    engine.maxFrequencyInArray = engine.audioCtx.sampleRate / (2 * engine.audioCtx.destination.channelCount);
                    engine.frequencyData = new Uint8Array(engine.analyser.frequencyBinCount);
                    engine.nbValuesToKeepInArray = helper.normalize(view.maxFrequencyDisplayed, engine.maxFrequencyInArray, engine.analyser.frequencyBinCount);
                    $scope.paused = false;
                    computeFFTParameters();
                    if (!$scope.$root.$$phase)
                        $scope.$apply();
                    startRendering();
                    startRenderingWave();
                    break;
                case 'seeking':
                    $scope.paused = false;
                    if (!$scope.$root.$$phase)
                        $scope.$apply();
                    break;
                case 'idle':
                    break;
                case 'paused':
                    $scope.paused = true;
                    if (!$scope.$root.$$phase)
                        $scope.$apply();
                    break;
                case 'dead':
                    engine.player.dispose();
                    $scope.currentPlayingTrack = null;
                    if (!$scope.$root.$$phase)
                        $scope.$apply();
                    break;
                case 'error':
                case 'ended':
                    $scope.playNext();
                    break;
            }
        };

        /************************
         * PARAMETERS REFRESHING
         ***********************/
        const computeFFTParameters = function () {
            view.canvas.width = view.width;
            view.canvas.height = view.height;
            view.nbBars = Math.min(view.width / 3, engine.nbValuesToKeepInArray);
            if (settings.nbBarsMax > 0)
                view.nbBars = Math.min(settings.nbBarsMax, view.nbBars);
            view.nbLines = Math.round(Math.min(settings.nbLinesMax, view.height / 2));
            view.barWidth = Math.max(2, Math.floor(view.width / view.nbBars * 2 / 3));
            view.nbBars = view.width / view.barWidth * 2 / 3;
            view.nbBars = Math.floor(Math.min(view.nbBars, view.width / 3, engine.nbValuesToKeepInArray));
            view.barHorizOffset = Math.max(1, Math.round((view.width - view.nbBars * view.barWidth * 1.5) / 2 + view.barWidth / 4));
            view.lineHeight = Math.round(Math.max(view.height / (2 * view.nbLines), 1));
            view.barArraySize = Math.floor(engine.nbValuesToKeepInArray / view.nbBars);
            view.canvasPreRenderCtx.clearRect(0, 0, view.barHorizOffset, view.height / 2 + 1);
            view.canvasPreRenderCtx.clearRect(view.width - view.barHorizOffset, 0, view.barHorizOffset, view.height / 2 + 1);
            for (let x = 0; x < view.nbBars; x++)
                view.canvasPreRenderCtx.clearRect(x * view.barWidth * 3 / 2 + view.barHorizOffset + view.barWidth, 0, view.barWidth / 2, view.height / 2 + 1);
        };

        /************************
         * RESIZING
         ***********************/
        const resize = function () {
            view.width = angular.element(view.canvas).width();
            view.height = angular.element(view.canvas).height();
            helper.resizeCanvasKeepContent(view.canvasPreRender, view.canvasPreRenderCtx, view.width, Math.ceil(view.height / 2));
            const canvasWaveWidth = angular.element(view.canvasWave).width();
            const canvasWaveHeight = angular.element(view.canvasWave).height();
            helper.resizeCanvasKeepContent(view.canvasWave, view.canvasWaveCtx, canvasWaveWidth, canvasWaveHeight);
            computeFFTParameters();
        };
        resize();
        let resizeTimer;
        angular.element($window).on('resize', function () {
            if (resizeTimer)
                $timeout.cancel(resizeTimer);
            resizeTimer = $timeout(resize, 1000);
        });

    }]);