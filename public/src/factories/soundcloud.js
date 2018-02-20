app.factory('sc-init', [function () {
    function connect(params) {
        console.info('Login in...');
        return initSession(params, false)
            .then(function () {
                return SC.connect().then(function (session) {
                    localStorage.setItem('souncloud.token', session.oauth_token);
                    return session.oauth_token;
                });
            })
            .catch(function (error) {
                console.error('Authentification error', error);
            });
    }

    function initSession(params, useLocalToken = true) {
        return new Promise(function (resolve, reject) {
            if (useLocalToken) {
                if (localStorage.getItem('souncloud.token') === null)
                    reject(params);
                params.oauth_token = localStorage.getItem('souncloud.token');
            }
            SC.initialize(params);
            resolve(params.oauth_token);
        });
    }

    return function (params) {
        return initSession(params)
            .catch(connect);
    }
}]);