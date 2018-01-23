app.factory('PetsByStatus', function($resource) {
  return {
    query: function(statusParam) {
      return $resource('http://petstore.swagger.io/v2/pet/findByStatus?status=:status', {}, {
        query: {
          method: 'GET',
          params: {status: statusParam},
          isArray: true
        }
      }).query();
    }
  }
});