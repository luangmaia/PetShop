services.factory('UserByUsername', function($resource) {
    return {
        query: function(usernameParam) {
            return $resource('http://petstore.swagger.io/v2/user/:username', {}, {
                query: {
                    method: 'GET',
                    params: {username: usernameParam}
                }
            }).query();
        }
    }
});