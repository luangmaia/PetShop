services.factory('OrderByID', function($resource) {
    return {
        query: function(idParam) {
            return $resource('http://petstore.swagger.io/v2/store/order/:id', {}, {
                query: {
                    method: 'GET',
                    params: {id: idParam}
                }
            }).query();
        }
    }
});