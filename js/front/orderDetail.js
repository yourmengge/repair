var orderDetail = angular.module('orderDetail', ['Road167']);
orderDetail.controller('orderDetailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.orderNo = sessionStorage.getItem('payment_detail_orderNo');
        $scope.get_order_detail();
    }
    //获取订单详情
    $scope.get_order_detail = function () {
        APIService.get_order_detail($scope.orderNo).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
            } else {
                isError(res);
            }
        })
    }
}])