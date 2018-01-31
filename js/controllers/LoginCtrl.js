app.controller('LoginCtrl', function($scope, $localStorage, $window, UserByUsername) {
    /* Verificar se está logado */
    if ($localStorage.userLogged != null) {
        $window.location.href = '#/comprar';
    }

    /* Funções */
    var fecharAlertIncorreto = function () {
        $scope.alertIncorreto = false;
    };

    /* Funções $scope */
    $scope.entrarClick = function () {
        var userResource = UserByUsername.query($scope.user.username);

        userResource.$promise.then(function () {
            if ($scope.user.password === userResource.password) {
                $localStorage.userLogged = userResource;
                $window.location.href = '#/comprar';
            } else {
                $scope.alertIncorreto = true;
            }
        }, function () {
            $scope.alertIncorreto = true;
        });
    };

    $scope.inputChange = function () {
        fecharAlertIncorreto();

        if ($scope.user.password != null && $scope.user.username != null && 
            $scope.user.password.length > 0 && $scope.user.username.length > 0) {
            $scope.formValid = true;
        } else {
            $scope.formValid = false;
        }
    };
});