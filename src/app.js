const app = angular.module("app", ["ngMaterial"]).config([
    "$mdThemingProvider",
    function ($mdThemingProvider) {
        $mdThemingProvider
            .theme("default")
            .primaryPalette("pink")
            .accentPalette("blue")
            .dark();
    },
]);

module.exports = app;
