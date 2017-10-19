var auth = angular.module('auth', ['Road167']);
auth.controller('authCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.orderNo = sessionStorage.getItem('orderNo');
        $scope.get_auth_detail();
    }
    $scope.get_auth_detail = function () {
        APIService.get_auth_detail($scope.orderNo).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
            } else {
                isError(res)
            }
        })
    }

}])