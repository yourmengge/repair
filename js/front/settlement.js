var settlement = angular.module('settlement', ['Road167']);
settlement.controller('settlementCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.orderNo = sessionStorage.getItem('payment_detail_orderNo');
        $scope.get_payment_detail();
    }
    //获取详情
    $scope.get_payment_detail = function () {
        APIService.get_payment_detail($scope.orderNo).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                if($scope.detail.chargeMode == 1){
                    $scope.isAuth = false;
                }
                if ((res.data.orderFlag & 1) > 0) {
                    $scope.isAuth = true;
                } else {
                    $scope.isAuth = false;
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.openImg = function (src) {
        setSession('photo_big', src)
        window.open('watchphoto.html')
    }
    $scope.goto = function (orderNo) {
        sessionStorage.setItem('orderNo', orderNo);
        goto_view('main/receipt/auth')
    }

}])