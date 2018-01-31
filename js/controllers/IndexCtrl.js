app.controller('IndexCtrl', function($scope, $window, $localStorage, $sessionStorage) {
    $scope.$storage = $localStorage;

    /* Funções $scope */
    $scope.deslogar = function () {
        $localStorage.userLogged = null;

        $window.location.href = '#/login';
    };
});