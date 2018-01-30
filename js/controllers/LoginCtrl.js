app.controller('LoginCtrl', function($scope, $localStorage, $window, UserByUsername) {
    /* Verificar se está logado */
    if ($localStorage.userLogged != null) {
        $window.location.href = '#/comprar';
    }

    /* Funções $scope */
    $scope.entrarClick = function () {
        console.log("Tentativa de login");
        var userResource = UserByUsername.query($scope.user.username);

        userResource.$promise.then(function () {
            if ($scope.user.password === userResource.password) {
                console.log("Login com sucesso");
                $localStorage.userLogged = userResource;
                $window.location.href = '#/comprar';
            } else {
                console.log("Senha incorreta");
            }
        }, function () {
            console.log("Usuário não existe");
        });
    };
});