var fitting = angular.module('fitting', ['Road167']);
fitting.controller('fittingCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.statusTexts = [{
        id: 'LIST_BILL',
        name: '全部'
    }, {
        id: 'UN_BILL',
        name: '未开票'
    }, {
        id: 'VERIFY',
        name: '审核中'
    }, {
        id: 'VERIFY_FAIL',
        name: '审核不通过'
    }]
    $scope.searchTexts = [{
        id: 0,
        name: '车牌号',
        text: '请输入车牌号'
    }, {
        id: 1,
        name: '保险公司',
        text: '请输入保险公司'
    }, {
        id: 2,
        name: '所属公司',
        text: '请输入所属公司'
    }, {
        id: 3,
        name: '订单号',
        text: '请输入订单号'
    }]
    $scope.chargeModeTexts = [{
        id: '',
        name: '显示全部'
    }, {
        id: '1',
        name: '收取现金'
    }, {
        id: '2',
        name: '免垫付'
    }]
    $scope.initData = function () {
        
    }
    //初始化页面时，初始化分页
    $scope.pageInit = function (current_page) {
        $scope.backPage = pageCount;
        $scope.frontPage = 1;
        $scope.current_page = current_page;
        $scope.page($scope.current_page);
    }
    $scope.showView = function () {
        $scope.viewHide = show;
    }
    $scope.select = function (data) {
        $scope.statusName = data.name;
        $scope.settleName = data.id;
        $scope.get_recepit_list();
    }
    $scope.selectChargeMode = function (data) {
        $scope.chargeModeName = data.name;
        $scope.chargeMode = data.id
        $scope.get_recepit_list();
    }
    $scope.selectSearch = function (data) {
        $scope.searchName = data.name;
        $scope.searchPlaceHolder = data.text;
        $scope.keywordType = data.id;
    }
    $scope.claer = function () {
        $scope.companyName = '';
        $scope.receiptName = '';
        $scope.carNo = '';
        $scope.orderNo = '';
    }
    //跳转到结算详情
    $scope.payment_detail = function (orderNo) {

        sessionStorage.setItem('payment_detail_orderNo', orderNo)
    }
    //清空参数
    $scope.clearPara = function () {
        $('#startDay').val('');
        $('#endDay').val('');
        $scope.startDay = '';
        $scope.endDay = '';
        $scope.keyword = '';
        $scope.claer();
        $scope.selectSearch($scope.searchTexts[0]);
        // $scope.select($scope.statusTexts[0]);
        $scope.current_page = 1;
        $scope.offset = 0;
    }

    //提交发票
    $scope.takePhoto = function (orderNo, settleStatus, remark) {
        removeSession('upload_pic')
        removeSession('upload_result')
        removeSession('pic_data')
        sessionStorage.setItem('payment_detail_orderNo', orderNo)
        sessionStorage.setItem('payment_detail_settleStatus', settleStatus)
        sessionStorage.setItem('payment_detail_remark', remark)
    }
    //处理复选款中选中的数据
    $scope.dear_checkBox_data = function (array) {
        $scope.array_list = '';
        angular.forEach(array, function (i, index) {
            if (index == 0) {
                $scope.array_list = $scope.array_list + 'orderNo=' + i;
            } else {
                $scope.array_list = $scope.array_list + '&orderNo=' + i;
            }

        })
    }
    //批量确认收款
    $scope.batch_receipt = function () {
        $scope.dear_checkBox_data($scope.checked);
        APIService.batch_receipt($scope.array_list).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                layer.msg('确认收款成功！');
                setTimeout(function () {
                    $scope.select_one = false;
                    $scope.all = false;
                    $scope.checked = [];
                    $scope.tab(2);
                }, 1000);
            } else {
                isError(res)
            }
        })
    }
    //确认收款（一条）
    $scope.submit_payment = function (orderNo) {
        if (confirm('是否确认收款？')) {
            APIService.batch_receipt('orderNo=' + orderNo).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('确认收款成功！');
                    setTimeout(function () {
                        $scope.tab(2);
                    }, 1000);
                } else {
                    isError(res)
                }
            })
        }


    }
    //全选
    $scope.selectAll = function () {
        $scope.select_one = false;
        if (!$scope.all) {
            $scope.select_one = true;
            $scope.all = true;
            $scope.checked = [];
            angular.forEach($scope.list, function (i, index) {
                $scope.checked.push(i.orderNo);

            })
            console.log($scope.checked)
        } else {
            $scope.all = false;
            $scope.select_one = false;
            $scope.checked = [];
        }
    }

    //单选
    $scope.selectOne = function (id) {
        if (contains($scope.checked, id)) {
            angular.forEach($scope.checked, function (i, index) {
                if ($scope.checked[index] == id) {
                    $scope.checked.splice(index, 1);
                    $scope.all = false;
                }
            })
        } else {
            $scope.checked.push(id);
            if ($scope.checked.length == $scope.list.length) {
                $scope.all = true;
            }
        }
    }
    //tab切换
    $scope.tab = function (type) {
        $scope.clearPara();
        $scope.selectTab = type;
        setSession('receipt_tab', type)
        switch (type) {
            case 1:
                $scope.settleName = 'LIST_BILL';
                break;
            case 2:
                $scope.settleName = 'PENDING_INSURANCE_PAY'
                break;
            case 3:
                $scope.settleName = 'INSURANCE_PAYED'
                break;
        }

        $scope.get_recepit_list();
        $scope.pageInit(1);
    }

    //导出
    $scope.toexcel = function (status, caseNo) {
        $scope.startDay = $('#startDay').val();
        $scope.endDay = $('#endDay').val();
        if ($scope.status == '') {//如果当前status为空值时，查询的status为下拉框中的值
            $scope.status = $scope.settleName;
        }
        switch ($scope.keywordType) {
            case 0:
                $scope.carNo = $scope.keyword;
                break;
            case 1:
                $scope.companyName = $scope.keyword;
                break;
            case 2:
                $scope.receiptName = $scope.keyword;
                break;
            case 3:
                $scope.orderNo = $scope.keyword;
                break;
        }
        window.open(host + urlV1 + '/order/payment/bill/export' + '?startDay=' + $scope.startDay + '&endDay=' + $scope.endDay +
            '&companyName=' + $scope.companyName + '&receiptName=' + $scope.receiptName + '&carNo=' + $scope.carNo + '&orderNo=' + $scope.orderNo +
            '&$limit=999&BillStatus=INSURANCE_PAYED&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }

    //收款管理
    $scope.get_recepit_list = function () {
        APIService.get_recepit_list($scope.startDay, $scope.endDay, $scope.settleName, $scope.companyName, $scope.receiptName, $scope.carNo, $scope.orderNo, $scope.chargeMode, $scope.limit, $scope.offset).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.count = res.data.count;
                $scope.list = res.data.items;
                $scope.totlePage = Math.ceil($scope.count / $scope.limit);
                $scope.array = generateArray($scope.totlePage);
                $scope.pageInit($scope.current_page);
            } else {
                isError(res);
            }
        })
    }

    //查询
    $scope.search = function () {
        $scope.offset = 0;
        $scope.startDay = $('#startDay').val();
        $scope.endDay = $('#endDay').val();
        if ($scope.status == '') {//如果当前status为空值时，查询的status为下拉框中的值
            $scope.status = $scope.settleName;
        }

        $scope.claer();
        switch ($scope.keywordType) {
            case 0:
                $scope.carNo = $scope.keyword;
                break;
            case 1:
                $scope.companyName = $scope.keyword;
                break;
            case 2:
                $scope.receiptName = $scope.keyword;
                break;
            case 3:
                $scope.orderNo = $scope.keyword;
                break;
        }
        $scope.get_recepit_list();
    }

    //分页
    $scope.page = function (a) {
        $scope.current_page = a;
        if ($scope.totlePage <= pageCount) {
            $scope.backPage = $scope.totlePage;
            $scope.frontPage = 1;
        } else {
            if (a >= Math.ceil(pageCount / 2)) {//如果选中的页数大于等于三，页数显示选中页的前两页及后两页
                if (a <= $scope.totlePage && a >= $scope.totlePage - pageCount / 2) {//如果选中最后两页，显示最后五页的信息
                    $scope.backPage = $scope.totlePage;
                    $scope.frontPage = $scope.totlePage - pageCount + 1;
                } else {
                    $scope.backPage = a + Math.ceil(pageCount / 2) - 1;
                    $scope.frontPage = a - (pageCount / 2);
                }

            } else {//如果选中第一第二页，展示前五页的信息
                $scope.backPage = pageCount;
                $scope.frontPage = 1;
            }
        }
        $scope.offset = (a - 1) * $scope.limit;
    }

    //分页跳转
    $scope.goPage = function (a) {
        $scope.page(a);
        APIService.get_recepit_list($scope.startDay, $scope.endDay, $scope.settleName, $scope.companyName, $scope.receiptName, $scope.carNo, $scope.orderNo, $scope.chargeMode, $scope.limit, $scope.offset).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.count = res.data.count;
                $scope.list = res.data.items;
                $scope.totlePage = Math.ceil($scope.count / $scope.limit);
                $scope.array = generateArray($scope.totlePage);
            } else {
                isError(res);
            }
        })
    }

}])