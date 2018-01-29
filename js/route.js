app.config(function($routeProvider) {
    var comprarTemplate = {
        templateUrl: 'view/comprar.html',
        controller: 'ComprarCtrl'
    };

    $routeProvider.when('/#', comprarTemplate);

    $routeProvider.when('/comprar', comprarTemplate);

    $routeProvider.when('/pedidos', {
        templateUrl: 'view/pedidos.html',
        controller: 'PedidosCtrl'
    });

    $routeProvider.when('/cadastro', {
        template: '<p>Em construção!</p>'
    });

    $routeProvider.when('/login', {
        template: '<p>Em construção!</p>'
    });

    $routeProvider.otherwise({redirectTo: '/#'});
});