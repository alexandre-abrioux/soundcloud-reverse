app.controller('MainCtrl', [
    '$scope',
    '$window',
    '$timeout',
    'sc-params',
    'sc-init',
    'helper',
    'settings',
    'view',
    'engine',
    function ($scope,
              $window,
              $timeout,
              scParams,
              sc,
              helper,
              settings,
              view,
              engine) {
        $scope.$timeout = $timeout;
        $scope.playlists = [];
        $scope.selectedPlaylistID = null;
        $scope.currentPlayingTrack = null;
        $scope.ready = false;
        $scope.refreshing = false;
        $scope.helper = helper;
        $scope.settings = settings;
        $scope.engine = engine;
        $scope.view = view;

        $scope.play = function (playlistID, trackID) {
            const playlist = $scope.playlists.find(helper.findByID(playlistID));
            const track = playlist.tracks.find(helper.findByID(trackID));
            $scope.currentPlayingTrack = track;
            console.debug('Track', track);
            console.info('Track [', trackID, '] > Queued');
            SC.stream('/tracks/' + trackID).then(function (player) {
                playAction(player, playlistID, trackID);
            });
        };
        $scope.playNext = function (playlistID, trackID) {
            const playlist = $scope.playlists.find(helper.findByID(playlistID));
            // in case playlists have been refreshed and this playlist doesn't exist anymore
            if (typeof playlist === 'undefined')
                return false;
            const trackIndex = playlist.tracks.findIndex(helper.findByID(trackID));
            let nextTrack;
            if (trackIndex < playlist.tracks.length - 1)
                nextTrack = playlist.tracks[trackIndex + 1];
            else
                nextTrack = playlist.tracks[0];
            $scope.play(playlist.id, nextTrack.id);
        };
        $scope.$watch('settings', function (settings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        }, true);
        $scope.$watch('settings.volume', function (volume) {
            engine.gainNode.gain.value = volume / 100;
        });
        $scope.$watch('settings.nbBarsMax', function () {
            $scope.resizeFFT();
        });
        $scope.$watch('settings.nbLinesMax', function () {
            $scope.resizeFFT();
        });
        $scope.$watch('settings.fftShow', function (fftShow, fftShowPrevious) {
            if (!fftShowPrevious && fftShow)
                renderFrame();
        });
        $scope.$watch('settings.fftEnlarge', function (fftEnlarge) {
            if (!fftEnlarge)
                settings.fftBehind = false;
            $timeout($scope.resizeFFT, 700);
        });
        $scope.disconnect = function () {
            localStorage.clear();
            window.location.reload();
        };
        $scope.init = function (refresh) {
            refresh = typeof refresh === 'undefined' ? false : refresh;
            $scope.refreshing = refresh;
            sc(scParams)
                .then(function (token) {
                    console.info('Soundcloud Token:', token);
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
                    if ($scope.selectedPlaylistID === null
                        || typeof $scope.playlists.find(helper.findByID($scope.selectedPlaylistID)) === 'undefined')
                        $scope.selectedPlaylistID = $scope.playlists[0].id;
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

        function renderFrame() {
            if (!settings.fftShow)
                return;
            if ($scope.currentPlayingTrack !== null)
                requestAnimationFrame(renderFrame);
            engine.analyser.getByteFrequencyData(engine.frequencyData);
            const frequencyDataTruncated = engine.frequencyData.subarray(0, engine.nbValuesToKeepInArray).map(function (value) {
                return value;
            });
            const frenquencyDataGrouped = new Uint8Array(view.nbBars);
            for (let i = 0; i < view.nbBars; i++) {
                const subArray = frequencyDataTruncated.subarray(view.barArraySize * i, view.barArraySize * (i + 1));
                frenquencyDataGrouped[i] = Math.max.apply(null, subArray);
                // frenquencyDataGrouped[i] = subArray.reduce((a, b) => a + b, 0) / subArray.length;
            }
            if (settings.intensify > 0 && engine.frequencyDataCopy !== null)
                for (let i = 0; i < view.nbBars; i++) {
                    const slope = frenquencyDataGrouped[i] - engine.frequencyDataCopy[i];
                    if (slope > 0) {
                        frenquencyDataGrouped[i] += slope * settings.intensify;
                        frenquencyDataGrouped[i] = Math.min(frenquencyDataGrouped[i], 255);
                    }
                }
            engine.frequencyDataCopy = frenquencyDataGrouped;
            view.canvasPreRenderCtx.drawImage(view.canvasPreRender, 0, view.lineHeight);
            // view.canvasPreRenderCtx.fillStyle = 'rgba(50, 90, 150, 0.0001)';
            // view.canvasPreRenderCtx.fillRect(0, 0, view.width, view.height / 2);
            for (let x = 0; x < view.nbBars; x++) {
                view.canvasPreRenderCtx.fillStyle = 'rgb(' + Math.min(50 + frenquencyDataGrouped[x], 255) + ', 90, 150)';
                view.canvasPreRenderCtx.fillRect(x * view.barWidth * 3 / 2 + view.barHorizOffset, 0, view.barWidth, view.lineHeight);
            }
            view.canvasCtx.drawImage(view.canvasPreRender, 0, 0);
            view.canvasCtx.scale(1, -1);
            view.canvasCtx.drawImage(view.canvasPreRender, 0, -view.height);
            view.canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
        }

        function playAction(player, playlistID, trackID) {
            player.on('state-change', createPlayerEventListener(player, playlistID, trackID));
            player.play();
        }

        function createPlayerEventListener(player, playlistID, trackID) {
            const playlist = $scope.playlists.find(helper.findByID(playlistID));
            const track = playlist.tracks.find(helper.findByID(trackID));
            const playerEventListener = function (e) {
                console.info('Track [', trackID, '] > State Change:', e);
                switch (e) {
                    case 'loading':
                        const audio = player.controller._html5Audio;
                        audio.crossOrigin = "anonymous";
                        break;
                    case 'playing':
                        $scope.currentPlayingTrack = track;
                        if (
                            typeof engine.audioSrc === 'object'
                            && engine.audioSrc !== null
                            && typeof engine.audioSrc.disconnect === 'function'
                        )
                            engine.audioSrc.disconnect();
                        engine.audioSrc = engine.audioCtx.createMediaElementSource(player.controller._html5Audio);
                        engine.audioSrc.connect(engine.analyser);
                        engine.audioSrc.connect(engine.gainNode);
                        engine.maxFrequencyInArray = engine.audioCtx.sampleRate / (2 * engine.audioCtx.destination.channelCount);
                        engine.frequencyData = new Uint8Array(engine.analyser.frequencyBinCount);
                        engine.nbValuesToKeepInArray = helper.normalize(view.maxFrequencyDisplayed, engine.maxFrequencyInArray, engine.analyser.frequencyBinCount);
                        $scope.$apply();
                        $scope.resizeFFT();
                        renderFrame();
                        break;
                    case 'idle':
                        break;
                    case 'paused':
                        break;
                    case 'dead':
                        player.off('state-change', playerEventListener);
                        player.dispose();
                        $scope.currentPlayingTrack = null;
                        $scope.$apply();
                        break;
                    case 'error':
                    case 'ended':
                        player.off('state-change', playerEventListener);
                        player.dispose();
                        $scope.currentPlayingTrack = null;
                        $scope.playNext(playlistID, trackID);
                        $scope.$apply();
                        break;
                }
            };
            return playerEventListener;
        }

        $scope.resizeFFT = function () {
            // console.info('resizeFFT');
            view.width = angular.element(view.canvas).width();
            view.height = angular.element(view.canvas).height();
            view.canvas.width = view.width;
            view.canvas.height = view.height;
            helper.resizeCanvasKeepContent(view.canvasPreRender, view.canvasPreRenderCtx, view.width, Math.ceil(view.height / 2));
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
        angular.element($window).on('resize', $scope.resizeFFT);

    }]);