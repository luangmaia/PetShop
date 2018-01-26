app.config(function($routeProvider) {

    $routeProvider.when('/#', {
        templateUrl: 'view/comprar.html',
        controller: 'ComprarCtrl'
    });

    $routeProvider.when('/comprar', {
        templateUrl: 'view/comprar.html',
        controller: 'ComprarCtrl'
    });

    $routeProvider.when('/pedidos', {
        template: '<p>Em construção!</p>'
    });

    $routeProvider.when('/cadastro', {
        template: '<p>Em construção!</p>'
    });

    $routeProvider.when('/login', {
        template: '<p>Em construção!</p>'
    });

    $routeProvider.otherwise({redirectTo: '/#'});
});