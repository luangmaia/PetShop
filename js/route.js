app.config(function($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'view/comprar.html',
        controller: 'ComprarCtrl'
    });

    $routeProvider.when('/comprar', {
        templateUrl: 'view/comprar.html',
        controller: 'ComprarCtrl'
    });

    $routeProvider.otherwise({redirectTo: '/'});
});