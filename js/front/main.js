var main = angular.module('main', ['Road167']);
main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.clicked = 1;
        if (sessionStorage.getItem('click_type') != undefined) {
            $scope.clicked = sessionStorage.getItem('click_type');
        } else {
            $scope.clicked = -1;
        }
    }
    $scope.click = function (type) {
        sessionStorage.setItem('click_type', type);
        $scope.clicked = type;
        if (type == 1) {
            setSession('receipt_tab', 1)
        } else if (type == 2) {
            setSession('payment_tab', 0)
        }
    }
    $scope.logout = function () {
        APIService.logout().then(function (res) {
            closeloading();
            if (res.data.http_status == 200 || res.data.http_status == 401.1) {
                layer.msg('退出成功');
                setTimeout(function () {
                    goto_view('login')
                }, 1000);
            }
        })
    }
    $scope.back = function () {
        window.history.back();
    }
    $scope.refresh = function(){
        location.reload();
    }
}])