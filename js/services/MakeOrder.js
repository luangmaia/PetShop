services.factory("MakeOrder", function($resource) {
    return $resource("http://petstore.swagger.io/v2/store/order", {}, {
        update: {method : "POST"}
    });
});