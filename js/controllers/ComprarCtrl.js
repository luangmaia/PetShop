app.controller('ComprarCtrl', function($scope, $localStorage, $window, PetsByStatus, MakeOrder, SavePet) {
	$localStorage.viewAtual = "comprar";
    
    $scope.$storage = $localStorage;
	$scope.arrayPets = [];
	var arrayPets = [];
	var aux = [];
	$scope.paginaAtual = 0;

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
		if (arrayPets.length <= pagina*2) {
			$scope.paginaAtual = pagina-1;
		} else {
			$scope.paginaAtual = pagina;
		}

		$scope.arrayPets = [];

		if (arrayPets.length >= $scope.paginaAtual*2+2) {
			$scope.arrayPets.push(arrayPets[$scope.paginaAtual*2]);
			$scope.arrayPets.push(arrayPets[$scope.paginaAtual*2+1]);
		} else {
			$scope.arrayPets.push(arrayPets[$scope.paginaAtual*2]);
		}
	}

	var colocarPetsNaArrayRow = function () {
		arrayPets = [];

		$scope.pets.$promise.then(function () {
			$scope.pets.sort(function(a, b) {
				if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
				if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
				return 0;
			});
			
			$scope.pets.forEach(function(pet, index) {
				if (pet.id == 9205436248879931000) {
					return;
				}

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
	
			atualizarPaginacao($scope.paginaAtual);
	
			$scope.paginas = new Array((Math.floor((arrayPets.length-1)/2))+1);
		});
	};

	var getPetsBD = function() {
		$scope.pets = PetsByStatus.query('disponivel');
		
		colocarPetsNaArrayRow();
	}

	/* Acesso a API */
	getPetsBD();

	/* Funções no escopo */
	$scope.botaoFotoAnterior = function(pet) {
		$scope.pets.$promise.then(function () {
			if (typeof pet.indexFotoAtual == 'undefined') {
				pet.indexFotoAtual = 0;
			}
			if (pet.indexFotoAtual > 0) {
				pet.indexFotoAtual--;
			}

			mudarFlagBotao(pet);
		});
	};

	$scope.botaoProximaFoto = function(pet) {
		$scope.pets.$promise.then(function () {
			if (typeof pet.indexFotoAtual == 'undefined') {
				pet.indexFotoAtual = 0;
			}
			if (pet.indexFotoAtual < pet.photoUrls.length-1) {
				pet.indexFotoAtual++;
			}

			mudarFlagBotao(pet);
		});
	};

	$scope.clickPagina = function(index) {
		atualizarPaginacao(index);
	};

	$scope.clickComprar = function(pet) {
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
		$scope.dataDeEntrega = [dd, mm, yyyy].join('/');
		$scope.petEscolhido = pet;
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

		var order = new MakeOrder(order);

		var orderResource = order.$update();

		orderResource.then(function() {
			resourcePetToSave.then(function() {
				$scope.numeroDoPedido = order.id;
				getPetsBD();
			});
		});
	};

	$scope.redirecionarLogin = function () {
		$window.location.href = '#/login';
	};
});