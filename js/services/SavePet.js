services.factory("SavePet", function($resource) {
  return $resource("http://petstore.swagger.io/v2/pet", {}, {
      update: {method : "POST"}
  });
});