app.controller('IndexCtrl', function($scope, $localStorage, $sessionStorage) {
    $scope.$storage = $localStorage;

    /* Funções $scope */
    $scope.deslogar = function () {
        $localStorage.userLogged = null;
    };
});