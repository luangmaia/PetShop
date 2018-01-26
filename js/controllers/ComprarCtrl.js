app.controller('ComprarCtrl', function($scope, PetsByStatus) {
	$scope.pets = PetsByStatus.query('disponivel');

	$scope.arrayPets = [];
	arrayPets = [];
	var aux = [];
	var paginaAtual = 0;

	/* Funções locais */
	var mudarFlagBotao = function (pet) {
		if (pet.indexFotoAtual == 0 && pet.indexFotoAtual == pet.photoUrls.length-1) {
			pet.flagBotaoAnterior = true;
			pet.flagBotaoProximo = true;
		} else if (pet.indexFotoAtual == 0) {
			pet.flagBotaoAnterior = true;
			pet.flagBotaoProximo = false;
		} else if (pet.indexFotoAtual == pet.photoUrls.length-1) {
			pet.flagBotaoAnterior = false;
			pet.flagBotaoProximo = true;
		}
	}

	var atualizarPaginacao = function (pagina) {
		paginaAtual = pagina;
		$scope.arrayPets = [];

		if (arrayPets.length > pagina*2+2) {
			$scope.arrayPets.push(arrayPets[pagina*2]);
			$scope.arrayPets.push(arrayPets[pagina*2+1]);
		} else {
			$scope.arrayPets.push(arrayPets[pagina*2]);
		}
	}

	/* Acesso a API */
	$scope.pets.$promise.then(function () {
		$scope.pets.forEach(function(pet, index) {
			if (aux.length == 4) {
				arrayPets.push(aux);
				aux = [];
			}

			aux.push(pet);
			pet.indexFotoAtual = 0;
			
			mudarFlagBotao(pet);
		});
		if (aux.length > 0) {
			arrayPets.push(aux);
		}

		atualizarPaginacao(0);

		$scope.paginas = new Array(Math.floor((($scope.pets.length-1)/8)+1));
	});

	console.log($scope.pets);

	/* Funções no escopo */
	$scope.botaoFotoAnterior = function(parentIndex, index) {
		$scope.pets.$promise.then(function () {
			if (typeof $scope.arrayPets[parentIndex][index].indexFotoAtual == 'undefined') {
				$scope.arrayPets[parentIndex][index].indexFotoAtual = 0;
			}
			if ($scope.arrayPets[parentIndex][index].indexFotoAtual > 0) {
				$scope.arrayPets[parentIndex][index].indexFotoAtual--;
			}

			mudarFlagBotao($scope.arrayPets[parentIndex][index]);
		});
	};

	$scope.botaoProximaFoto = function(parentIndex, index) {
		$scope.pets.$promise.then(function () {
			if (typeof $scope.arrayPets[parentIndex][index].indexFotoAtual == 'undefined') {
				$scope.arrayPets[parentIndex][index].indexFotoAtual = 0;
			}
			if ($scope.arrayPets[parentIndex][index].indexFotoAtual < $scope.arrayPets[parentIndex][index].photoUrls.length-1) {
				$scope.arrayPets[parentIndex][index].indexFotoAtual++;
			}

			mudarFlagBotao($scope.arrayPets[parentIndex][index]);
		});
	};

	$scope.clickPagina = function(index) {
		atualizarPaginacao(index);
	};
});