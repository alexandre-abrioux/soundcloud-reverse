const app = require('../app');

app.factory('sc-params', [function () {
    return {
        client_id: process.env.NODE_ENV === "production"
            ? window.settings.SOUNDCLOUD_CLIENT_ID
            : process.env.SOUNDCLOUD_CLIENT_ID,
        redirect_uri: process.env.NODE_ENV === "production"
            ? window.settings.SOUNDCLOUD_REDIRECT_URI
            : process.env.SOUNDCLOUD_REDIRECT_URI
    }
}]);
