<?php
require __DIR__ . '/vendor/autoload.php';
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();
?>
<!DOCTYPE html>
<html ng-app="app">
<head>
    <title>SoundCloud Reverse</title>
    <meta charset="utf-8">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?v=1">
    <link href="https://fonts.googleapis.com/css?family=Rajdhani:400,700" rel="stylesheet">
    <link rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet"
          href="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.3/angular-material.css">
    <link rel="stylesheet" href="index.css?v=<?= hash_file('crc32', 'index.css') ?>">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://connect.soundcloud.com/sdk/sdk-3.1.2.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.5/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.5/angular-animate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.5/angular-aria.min.js"></script>
    <script src="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.3/angular-material.js"></script>
    <script type="text/javascript" src="src/app.js"></script>
    <script type="text/javascript" src="src/factories/helper.js"></script>
    <script type="text/javascript" src="src/factories/settings.js"></script>
    <script type="text/javascript" src="src/factories/view.js"></script>
    <script type="text/javascript" src="src/factories/engine.js"></script>
    <script type="text/javascript" src="src/factories/soundcloud.js"></script>
    <script type="text/javascript" src="src/controller.js"></script>
    <script type="text/javascript">
        app.factory('sc-params', [function () {
            return {
                client_id: '<?= getenv('SOUNDCLOUD_CLIENT_ID') ?>',
                redirect_uri: '<?= getenv('SOUNDCLOUD_REDIRECT_URI') ?>'
            }
        }]);
    </script>
</head>
<body ng-controller="MainCtrl"
      ng-class="{
      'playing':currentPlayingTrack !== null && !paused,
      'fftShow':settings.fftShow,
      'fftEnlarge':settings.fftEnlarge,
      'fftBehind':settings.fftBehind
      }" ng-cloak>
<div id="welcome" ng-show="!ready">
    <md-button class="md-raised md-primary" ng-click="init()">Connect with SoundCloud</md-button>
</div>
<div id="container" ng-show="ready">
    <div id="wrapper">
        <i id="refresh" class="fa fa-refresh" aria-hidden="true"
           ng-class="{'active':refreshing, 'fa-spin':refreshing}"
           ng-click="init(true)"></i>
        <md-select ng-model="settings.selectedPlaylistID" aria-label="playlists" style="width:90%;">
            <md-option ng-repeat="playlist in playlists" ng-value="playlist.id">
                {{playlist.title}}
            </md-option>
        </md-select>
        <div ng-show="settings.selectedPlaylistID !== null"
             ng-repeat="track in playlists.find(helper.findByID(settings.selectedPlaylistID)).tracks"
             class="track-wrapper"
             ng-click="play(playlists.find(helper.findByID(settings.selectedPlaylistID)), track)">
            <a ng-href="{{ track.permalink_url }}" target="_blank">
                <i class="fa fa-external-link" aria-hidden="true"></i>
            </a>
            <div class="track"
                 ng-class="{'active':currentPlayingTrack!== null && currentPlayingTrack.id === track.id}">
                <i class="fa fa-play" aria-hidden="true"></i>
                [ <span ng-bind="track.user.username"></span> ] <span ng-bind="track.title"></span>
            </div>
        </div>
    </div>
</div>
<canvas id="fft" ng-show="ready && settings.fftShow"></canvas>
<div id="controls" ng-show="ready">
    <i id="controls-icon" class="fa fa-cog fa-3x"></i>
    <div id="controls-content-wrapper">
        <div id="controls-content">
            <div layout="row">
                <div>
                    <span>Settings</span>
                    <md-switch ng-model="settings.fftShow" class="md-primary">Visual</md-switch>
                    <md-switch ng-show="settings.fftShow" ng-model="settings.fftEnlarge"
                               class="md-primary">Full Screen
                    </md-switch>
                    <md-switch ng-show="settings.fftShow"
                               ng-model="settings.fftBehind" ng-true-value="false" ng-false-value="true"
                               ng-class="{'md-primary':settings.fftEnlarge}"
                               ng-disabled="!settings.fftEnlarge">Behind
                    </md-switch>
                </div>
                <md-slider-container>
                    <span>Volume</span>
                    <md-slider ng-model="settings.volume" min="0" max="100" step="1" round="0"
                               md-vertical aria-label="volume"></md-slider>
                </md-slider-container>
                <md-slider-container ng-show="settings.fftShow">
                    <span>Bars</span>
                    <md-slider ng-model="settings.nbBarsMax" min="0" max="255" step="5" round="0"
                               md-vertical aria-label="bars"></md-slider>
                </md-slider-container ng-show="settings.fftShow" >
                <md-slider-container ng-show="settings.fftShow">
                    <span>Lines</span>
                    <md-slider ng-model="settings.nbLinesMax" min="1" max="50" step="1" round="0"
                               md-vertical aria-label="lines"></md-slider>
                </md-slider-container>
                <md-slider-container ng-show="settings.fftShow">
                    <span>Smooth</span>
                    <md-slider ng-model="settings.smoothing" min="0" max="99" step="1" round="0"
                               md-vertical aria-label="smoothing"></md-slider>
                </md-slider-container>
                <md-slider-container ng-show="settings.fftShow">
                    <span>Accent</span>
                    <md-slider ng-model="settings.accent" min="0" max="100" step="1" round="0"
                               md-vertical aria-label="accent"></md-slider>
                </md-slider-container>
            </div>
            <div style="text-align: right;padding-top:10px;">
                <small ng-click="disconnect()" style="cursor:pointer;"><i>diconnect</i></small>
            </div>
        </div>
    </div>
</div>
<div id="controls-playback">
    <div id="controls-playback-img-placeholder">
        <img ng-src="{{ currentPlayingTrack.artwork_url }}" ng-if="currentPlayingTrack.artwork_url">
    </div>
    <div id="controls-playback-content">
        <a ng-href="{{ currentPlayingTrack.permalink_url }}" target="_blank">
            <i class="fa fa-external-link" aria-hidden="true"></i>
        </a>
        <div ng-bind="currentPlayingTrack.user.username" id="controls-playback-artist"></div>
        <div ng-bind="currentPlayingTrack.title"></div>
    </div>
</div>
</body>
</html>