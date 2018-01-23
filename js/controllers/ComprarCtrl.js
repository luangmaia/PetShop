app.controller('ComprarCtrl', function($scope, PetsByStatus) {
    $scope.pets = PetsByStatus.query('disponivel');
    console.log($scope.pets);

    $scope.fotoAtual = "";
    //$scope.fotoAtual = $scope.pet.photoUrls[0];
    $scope.indexFotoAtual = 0;

    $scope.botaoFotoAnterior = function() {
        if ($scope.indexFotoAtual > 0) {
            $scope.indexFotoAtual--;
        }
    };

    $scope.botaoProximaFoto = function(index) {
        $scope.pets.$promise.then(function () {
            if ($scope.indexFotoAtual < $scope.pets[index].photoUrls.length-1) {
                $scope.indexFotoAtual++;
            }
        });
    };
});