app.controller('ComprarCtrl', function($scope, PetsByStatus, MakeOrder, SavePet) {
	$scope.arrayPets = [];
	var arrayPets = [];
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
		if ($scope.pets.length <= pagina*8) {
			paginaAtual = pagina-1;
		} else {
			paginaAtual = pagina;
		}
		console.log("Pagina atual: " + paginaAtual);

		$scope.arrayPets = [];

		if (arrayPets.length >= paginaAtual*2+2) {
			$scope.arrayPets.push(arrayPets[paginaAtual*2]);
			$scope.arrayPets.push(arrayPets[paginaAtual*2+1]);
		} else {
			$scope.arrayPets.push(arrayPets[paginaAtual*2]);
		}
	}

	var getPetsBD = function() {
		arrayPets = [];
		
		$scope.pets = PetsByStatus.query('disponivel');
		$scope.pets.$promise.then(function () {
			console.log($scope.pets);

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
				aux = [];
			}

			console.log("arrayPets depois");
			console.log(arrayPets);
	
			atualizarPaginacao(paginaAtual);
	
			console.log("$scope.arrayPets.length = " + $scope.arrayPets.length);
			console.log("arrayPets.length = " + arrayPets.length);
			$scope.paginas = new Array(Math.floor(((arrayPets.length-1/2))));
		});
	}

	/* Acesso a API */
	getPetsBD();

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

	$scope.clickComprar = function(parentIndex, index) {
		var today = new Date();
		today.setDate(today.getDate() + 3);
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd = '0'+dd
		} 
		
		if(mm<10) {
			mm = '0'+mm
		}
		console.log([dd, mm, yyyy].join('/'));
		$scope.dataDeEntrega = [dd, mm, yyyy].join('/');
		$scope.petEscolhido = $scope.arrayPets[parentIndex][index];
	};

	$scope.clickConfirmarPedido = function() {
		var today = new Date();
		today.setDate(today.getDate() + 3);
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd = '0'+dd
		} 
		
		if(mm<10) {
			mm = '0'+mm
		}
		var dataDeEntrega = [yyyy, mm, dd].join('-');

		var order = {
			"id": $scope.petEscolhido.id,
			"petId": $scope.petEscolhido.id,
			"quantity": 1,
			"shipDate": dataDeEntrega,
			"status": "enviado",
			"complete": false
		}

		$scope.petEscolhido.status = "vendido";
		var petToSave = new SavePet($scope.petEscolhido);
		var resourcePetToSave = petToSave.$update();
		console.log(resourcePetToSave);
		console.log(petToSave);
		console.log($scope.petEscolhido);

		var order = new MakeOrder(order);

		var orderResource = order.$update();

		orderResource.then(function() {
			resourcePetToSave.then(function() {
				console.log("Tamanho $scope.pets: " + $scope.pets.length);
				$scope.numeroDoPedido = order.id;
				//console.log("numeroDoPedido = " + $scope.numeroDoPedido);
				getPetsBD();
			});
		});
	};
});