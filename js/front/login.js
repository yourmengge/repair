var login = angular.module('login', ['Road167']);
login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        goto_view('main/message')
        // if ($scope.user != null && $scope.password != null) {
        //     APIService.login($scope.user, $scope.password).then(function (res) {
        //         if (res.data.http_status == 200) {
        //             goto_view('main/receipt')
        //             setSession('receipt_tab', 1)
        //             setSession('click_type', 1)
        //         } else {
        //             isError(res);
        //         }
        //     })
        // }
    }
}])