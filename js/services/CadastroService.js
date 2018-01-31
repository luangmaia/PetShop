services.factory("CadastroService", function($resource) {
    return $resource("http://petstore.swagger.io/v2/user", {}, {
        update: {method : "POST"}
    });
});