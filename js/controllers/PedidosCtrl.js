app.controller('PedidosCtrl', function($scope, $localStorage, $window, OrderByID, PetByID, SavePet, MakeOrder, CancelOrderFirebase, GetUserPedidos) {
    $localStorage.viewAtual = "pedidos";
    
    if ($localStorage.userLogged == null) {
        $window.location.href = '#/login';
    }

    $scope.pedidosUser = [];

    var pedidoOriginal = null;
    
    var inputAnterior = "";

    /*--------- Funções ---------*/
    var carregarPetsUser = function () {
        $scope.pedidosUser = [];

        var pedidosUserID = GetUserPedidos.query($localStorage.userLogged.username);
    
        pedidosUserID.$promise.then(function () {
            for (propertyName in pedidosUserID) {
                if ((!isNaN(propertyName)) && propertyName != null && pedidosUserID[propertyName].id != null) {
                    $scope.pedidosUser.push(getOrderByID(propertyName));
                }
            }
        });
    };
    carregarPetsUser();

    var getOrderByID = function (orderID) {
        if (orderID != null && orderID !== "") {
            /* Pegando o pedido na API */
            var pedido = OrderByID.query(orderID);

            //$scope.pedido = getOrderByID(4535435465);

            pedido.$promise.then(function() { //Pedido pronto
                pedido.pedidoPronto = true;

                /* Cuidando da data */
                pedido.shipDateFormatted = pedido.shipDate;
                var datePedido = new Date(pedido.shipDateFormatted);
                var dd = datePedido.getDate();
                var mm = datePedido.getMonth()+1;
                var yyyy = datePedido.getFullYear();
                if(dd<10) {
                    dd = '0'+dd
                } 
                if(mm<10) {
                    mm = '0'+mm
                }
                pedido.shipDateFormatted = [dd, mm, yyyy].join('/');

                /* Pegando o animal na API */
                pedido.petPedido = PetByID.query(pedido.petId);
                pedido.petPedido.$promise.then(function () {
                    pedido.petPedidoPronto = true;
                    pedido.petPedido.indexFotoAtual = 0;
                    mudarFlagBotao(pedido.petPedido);
                }, function () { 
                    pedido.petPedidoPronto = false;
                    pedido.petPedido = null;
                });
            });

            return pedido;
        };
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
    $scope.cancelarPedido = function () {
        var pedido = $scope.pedidoParaCancelar;
        var orderID = pedido.id;

        //$scope.petPedido.status = 'disponivel';
        pedido.petPedido.status = 'disponivel';
        var petToSave = new SavePet(pedido.petPedido);
        var resourcePetToSave = petToSave.$update();

        //$scope.pedido.status = 'cancelado';
        pedido.status = 'cancelado';
        var order = new MakeOrder(pedido);
        var orderResource = order.$update();

        var pedidoNaoEfetuado = function () {
            $scope.numeroPedidoCancelado = orderID;
            $scope.pedidoCanceladoSucesso = false;
        };
        
        resourcePetToSave.then(function() {
            orderResource.then(function() {
                getOrderByID(orderID);
                $scope.numeroPedidoCancelado = orderID;
                $scope.pedidoCanceladoSucesso = true;

                //carregarPetsUser();
            }, pedidoNaoEfetuado);
        }, pedidoNaoEfetuado);
    };

    $scope.fecharAlertConfirmacao = function () {
        $scope.numeroPedidoCancelado = null;
        $scope.pedidoCanceladoSucesso = null;
    };

    $scope.botaoFotoAnterior = function(pet) {
        if (typeof pet.indexFotoAtual == 'undefined') {
            pet.indexFotoAtual = 0;
        }
        if (pet.indexFotoAtual > 0) {
            pet.indexFotoAtual--;
        }

        mudarFlagBotao(pet);
	};

	$scope.botaoProximaFoto = function(pet) {
        if (typeof pet.indexFotoAtual == 'undefined') {
            pet.indexFotoAtual = 0;
        }
        if (pet.indexFotoAtual < pet.photoUrls.length-1) {
            pet.indexFotoAtual++;
        }

        mudarFlagBotao(pet);
    };

    $scope.setarPedidoParaCancelar = function (pedido) {
        $scope.pedidoParaCancelar = pedido;
    }
});