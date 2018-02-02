services.factory('GetUserPedidos', function($resource) {
    return {
        query: function(usernameParam) {
            return $resource('https://opus-pets.firebaseio.com/cliente-pedidos/:username.json', {}, {
                query: {
                    method: 'GET',
                    params: {
                        username: usernameParam
                    }
                }
            }).query();
        }
    }
});