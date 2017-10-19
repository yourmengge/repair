var batch = angular.module('batch', ['Road167']);
batch.controller('batchCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
    $scope.initData = function () {
        $scope.clicked = 1;
        $scope.fileName = '';
        $scope.batchList = [];
        $scope.file_type = false;
        $scope.clickIndex = 0;
        $scope.hide_div = true;
        $scope.get_unmatch_list();

    }
    $scope.select_file = function (data, index) {
        sessionStorage.setItem('select_index', index);
        $scope.clickIndex = index;
        if (data == undefined) {
            $scope.unMatchList = '';
        } else {
            $scope.unMatchList = data.detailList;
        }

    }
    $scope.delete_file = function (data) {
        if (confirm('确定删除' + data.fileName + '，删除后数据不再显示！')) {
            APIService.delete_file(data.incomeId).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {

                    layer.msg('删除成功')
                    $scope.get_unmatch_list();
                } else {
                    isError(res);
                }
            })
        }

    }
    //订单匹配
    $scope.match_order = function (carNo, id) {
        $scope.matchId = id;
        $scope.hide_div = false;
        $scope.get_carNo_unmatch_list(carNo)
    }
    //查询某车牌号为匹配的订单列表
    $scope.get_carNo_unmatch_list = function (carNo) {
        APIService.get_carNo_unmatch_list(carNo).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.carNo_list = res.data.items;
            } else {
                isError(res);
            }
        })
    }
    //删除单个订单
    $scope.delete_order_detail = function (data, list) {
        if (list.length == 1) {
            if (confirm('确定删除最后一条数据，删除后数据文件不再显示！')) {
                APIService.delete_order_detail(data.id).then(function (res) {
                    closeloading();
                    if (res.data.http_status == 200) {
                        layer.msg('删除成功');
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            }
        } else {
            if (confirm('确定删除数据，删除后数据不再显示！')) {
                APIService.delete_order_detail(data.id).then(function (res) {
                    closeloading();
                    if (res.data.http_status == 200) {
                        layer.msg('删除成功');
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            }
        }


    }
    //匹配订单
    $scope.match = function (orderNo) {
        var data = {
            id: $scope.matchId,
            orderNo: orderNo
        }
        APIService.match_order(data).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                layer.msg('匹配成功,该订单已确认收款！');
                $scope.hide_div = hide;
                $scope.initData();
            } else {
                isError(res);
            }
        })
    }
    $scope.file = function () {
        var f = document.getElementById("file").value;
        $scope.fileName = document.getElementById("file").files[0].name;
        if (!/\.(xls|xlsx)$/.test(f)) {
            layer.msg("上传文件格式不支持！");
            $scope.file_title = '';
            document.getElementById("file").value = '';
            return false;
        } else {
            var input = document.getElementById("file");
            var formData = new FormData();
            formData.append('file', input.files[0])
            loading();
            $http({
                method: 'POST',
                url: host + urlV1 + '/order/income/import/' + $scope.file_type,
                data: formData,
                headers: {
                    "Content-Type": undefined,
                    "Authorization": APIService.token,
                    "user-id": APIService.userId
                }, transformRequest: angular.identity,
            }).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    $scope.remarkId = res.data.tmpKey
                    $scope.batchList = res.data.tmpDataList;
                    $scope.file_type = !$scope.file_type;
                } else if (res.data.http_status == 400) {
                    $scope.file_title = '';
                    if (confirm(res.data.message)) {
                        $scope.file_type = true;
                        $scope.file();
                    } else {
                        document.getElementById("file").value = '';
                        $scope.fileName = '';
                    }

                }
            })
        }
    }
    //关闭弹窗
    $scope.close_panel = function () {
        $scope.hide_div = true;
    }
    //获取未匹配列表
    $scope.get_unmatch_list = function () {
        APIService.get_unmatch_list().then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.unMatchFile = res.data.list;
                if (sessionStorage.getItem('select_index') != 0) {
                    $scope.clickIndex = sessionStorage.getItem('select_index');
                    $scope.select_file(res.data.list[$scope.clickIndex], $scope.clickIndex)
                } else {
                    $scope.select_file(res.data.list[0], 0)
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.confirm_batch = function () {
        if (confirm('确定提交匹配数据，数据匹配成功将自动确认已收款！')) {
            APIService.confirm_batch($scope.remarkId).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    document.getElementById("file").value = '';
                    if (res.data.unMatchList.length == 0) {
                        layer.msg('信息全部匹配成功！')
                        $scope.initData();
                    } else {
                        layer.msg('有信息未匹配成功！')
                        $scope.initData();
                        sessionStorage.setItem('select_index', 0)
                        $scope.clicked = 2;
                    }
                } else {
                    isError(res);
                }
            })
        }

    }
}])