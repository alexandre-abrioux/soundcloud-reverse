const app = require("../app");

app.factory("sc-params", [
    function () {
        return {
            client_id: process.env.SOUNDCLOUD_CLIENT_ID,
            redirect_uri: process.env.SOUNDCLOUD_REDIRECT_URI,
        };
    },
]);
