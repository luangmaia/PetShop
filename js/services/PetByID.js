services.factory('PetByID', function($resource) {
    return {
        query: function(idParam) {
            return $resource('http://petstore.swagger.io/v2/pet/:id', {}, {
                query: {
                    method: 'GET',
                    params: {id: idParam}
                }
            }).query();
        }
    }
});