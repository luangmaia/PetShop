app.controller('PedidosCtrl', function($scope, $localStorage, $window, OrderByID, PetByID, SavePet, MakeOrder) {
    $localStorage.viewAtual = "pedidos";
    
    if ($localStorage.userLogged == null) {
        $window.location.href = '#/login';
    }

    var pedidoOriginal = null;
    var orderIDPedido = -1;
    
    var inputAnterior = "";

    /*--------- Funções ---------*/
    var anularPedidoPet = function () {
        $scope.pedidoPronto = false;
        $scope.petPedidoPronto = false;
        $scope.pedido = null;
        $scope.petPedido = null;
    };

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
	};

    /*--------- Funções $scope ---------*/
    $scope.getOrderByID = function (orderID) {
        orderIDPedido = orderID;

        if (orderID != null && orderID !== "") {
            /* Pegando o pedido na API */
            pedidoOriginal = OrderByID.query(orderID);
            $scope.pedido = pedidoOriginal;

            //$scope.pedido = getOrderByID(4535435465);

            $scope.pedido.$promise.then(function() { //Pedido pronto
                $scope.pedidoPronto = true;

                /* Cuidando da data */
                $scope.pedido.shipDateFormatted = $scope.pedido.shipDate;
                var datePedido = new Date($scope.pedido.shipDateFormatted);
                var dd = datePedido.getDate();
                var mm = datePedido.getMonth()+1;
                var yyyy = datePedido.getFullYear();
                if(dd<10) {
                    dd = '0'+dd
                } 
                if(mm<10) {
                    mm = '0'+mm
                }
                $scope.pedido.shipDateFormatted = [dd, mm, yyyy].join('/');

                /* Pegando o animal na API */
                $scope.petPedido = PetByID.query($scope.pedido.petId);
                $scope.petPedido.$promise.then(function () {
                    $scope.petPedidoPronto = true;
                    $scope.petPedido.indexFotoAtual = 0;
                    mudarFlagBotao($scope.petPedido);
                }, function () { 
                    $scope.petPedidoPronto = false;
                    $scope.petPedido = null;
                });

            }, function() { //Caso não for possível pegar o pedido
                anularPedidoPet();
            });
        };
    };

    $scope.cancelarPedido = function () {
        $scope.pedido.$promise.then(function() {
            //$scope.petPedido.status = 'disponivel';
            var petToSave = new SavePet($scope.petPedido);
            petToSave.status = 'disponivel';
            var resourcePetToSave = petToSave.$update();

            //$scope.pedido.status = 'cancelado';
            var order = new MakeOrder(pedidoOriginal);
            order.status = 'cancelado';
            var orderResource = order.$update();

            var pedidoNaoEfetuado = function () {
                $scope.numeroPedidoCancelado = orderIDPedido;
                $scope.pedidoCanceladoSucesso = false;
            };
            
            resourcePetToSave.then(function() {
                orderResource.then(function() {
                    $scope.getOrderByID(orderIDPedido);
                    $scope.pedido.$promise.then(function() {
                        $scope.numeroPedidoCancelado = orderIDPedido;
                        $scope.pedidoCanceladoSucesso = true;
                    });
                }, pedidoNaoEfetuado);
            }, pedidoNaoEfetuado);
        });
    };

    $scope.fecharAlertConfirmacao = function () {
        $scope.numeroPedidoCancelado = null;
        $scope.pedidoCanceladoSucesso = null;
    };

    $scope.botaoFotoAnterior = function(pet) {
		$scope.petPedido.$promise.then(function () {
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
		$scope.petPedido.$promise.then(function () {
			if (typeof pet.indexFotoAtual == 'undefined') {
				pet.indexFotoAtual = 0;
			}
			if (pet.indexFotoAtual < pet.photoUrls.length-1) {
				pet.indexFotoAtual++;
			}

			mudarFlagBotao(pet);
		});
    };
    
    $scope.inputChange = function() {
        var regex = RegExp(/(^[^\-]{0,1})?(^[\d]*)$/);
        if( regex.exec($scope.pedidoID) != null ) {
            inputAnterior = $scope.pedidoID;
        } else {
            $scope.pedidoID = inputAnterior;
        }
    }
});