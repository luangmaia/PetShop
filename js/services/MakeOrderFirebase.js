services.factory('MakeOrderFirebase', function($resource) {
    return {
        makeOrder: function(usernameParam, orderIDParam) {
            var resourceReturn = $resource('https://opus-pets.firebaseio.com/cliente-pedidos/:username/:orderID.json', {}, {
                update: {
                    method: 'PUT',
                    params: {
                        username: usernameParam,
                        orderID: orderIDParam
                    }
                }
            });

            var res = new resourceReturn({
                "id": orderIDParam
            });

            res.$update();
        }
    }
});