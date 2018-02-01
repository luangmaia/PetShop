app.controller('CadastroCtrl', function($scope, $localStorage, $window, CadastroService, UserByUsername) {
    $localStorage.viewAtual = "cadastro";
    
    /* Verificar se está logado */
    if ($localStorage.userLogged != null) {
        $window.location.href = '#/comprar';
    }

    /* Funções $scope */
    $scope.cadastrarClick = function () {
        var userResourceExiste = UserByUsername.query($scope.user.username);

        userResourceExiste.$promise.then(function () {
            $scope.alertUsuarioExiste = true;
        }, function () {
            var user = new CadastroService($scope.user);

            var userResource = user.$update();

            userResource.then(function() {
                var userResource = UserByUsername.query($scope.user.username);

                userResource.$promise.then(function () {
                    $localStorage.userLogged = userResource;
                    $window.location.href = '#/comprar';
                });
            });
        });
    };

    $scope.inputChange = function () {
        if ($scope.user.password != null && $scope.user.password.length > 0 && 
            $scope.user.username != null && $scope.user.username.length > 0 && 
            $scope.user.email != null && $scope.user.email.length > 0 && 
            $scope.user.firstName != null && $scope.user.firstName.length > 0 && 
            $scope.user.lastName != null && $scope.user.lastName.length > 0) {
            $scope.formValid = true;
        } else {
            $scope.formValid = false;
        }
    };

    $scope.fecharAlertUsuarioExiste = function () {
        $scope.alertUsuarioExiste = false;
    };
});