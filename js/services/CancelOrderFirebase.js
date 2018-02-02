services.factory('CancelOrderFirebase', function($resource) {
    return {
        cancelOrder: function(usernameParam, orderIDParam) {
            var resourceReturn = $resource('https://opus-pets.firebaseio.com/cliente-pedidos/:username/:orderID.json', {}, {
                update: {
                    method: 'PUT',
                    params: {
                        username: usernameParam,
                        orderID: orderIDParam
                    }
                }
            });

            var res = new resourceReturn(null);

            res.$update();
        }
    }
});