app.controller('PedidosCtrl', function($scope, OrderByID, PetByID) {
    /*--------- Funções ---------*/
    $scope.getOrderByID = function (orderID) {
        if (orderID != null && orderID !== "") {
            /* Pegando o pedido na API */
            $scope.pedido = OrderByID.query(orderID);

            //$scope.pedido = getOrderByID(3435435485);

            $scope.pedido.$promise.then(function() { //Pedido pronto
                $scope.pedidoPronto = true;

                /* Cuidando da data */
                var datePedido = new Date($scope.pedido.shipDate);
                var dd = datePedido.getDate();
                var mm = datePedido.getMonth()+1;
                var yyyy = datePedido.getFullYear();
                if(dd<10) {
                    dd = '0'+dd
                } 
                if(mm<10) {
                    mm = '0'+mm
                }
                $scope.pedido.shipDate = [dd, mm, yyyy].join('/');

                /* Pegando o animal na API */
                $scope.petPedido = PetByID.query($scope.pedido.petId);
                $scope.petPedido.$promise.then(function () {
                    $scope.petPedidoPronto = true;
                    console.log($scope.petPedido);
                }, function () { 
                    $scope.petPedidoPronto = false;
                    $scope.petPedido = null;
                });

                console.log($scope.pedido);
            }, function() { //Caso não for possível pegar o pedido
                $scope.pedidoPronto = false;
                $scope.petPedidoPronto = false;
                $scope.pedido = null;
                $scope.petPedido = null;
            });
        };
    }
});