var payment = angular.module('payment', ['Road167']);
payment.controller('paymentCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.searchTexts = [{
        id: 1,
        name: '所属公司',
        text: '请输入所属公司'
    }, {
        id: 2,
        name: '车队名',
        text: '请输入车队名'
    }]
    $scope.statusTexts = [{
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
        $scope.checked = [];
        $scope.select_one = false;
        $scope.moreOrder = show;
        $scope.selectCount = 0;
        $scope.selectTab = 0;
        $scope.chargeMode = '';
        $scope.statusName = '显示全部';
        $scope.searchName = '所属公司';
        $scope.searchPlaceHolder = '请输入所属公司';
        $scope.status = 'PENDING_PAY';
        $scope.limit = 10;
        $scope.limit2 = 100;
        $scope.fleetName = '';
        $scope.receiptName = '';
        $scope.offset = 0;
        $scope.hide_div = true;
        $scope.keywordType = 0;
        $scope.keyword = '';
        $scope.get_service();
        // $scope.get_payment_list();
        // $scope.get_unMerge_list();
        if (getSession('payment_tab') == 0) {
            $scope.tab(0, '');
        } else if (getSession('payment_tab') == 1) {
            $scope.tab(1, 'PENDING_PAY');
        } else {
            $scope.tab(2, 'PAYED');
        }



        //初始化分页
        $scope.pageInit(1);
        $scope.backPage = pageCount;
        $scope.frontPage = 1;
        $scope.current_page = 1;
    }
    $scope.select = function (data) {
        $scope.statusName = data.name;
        $scope.settleName = data.id;
        $scope.chargeMode = data.id
        $scope.get_unMerge_list();
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
    $scope.tab = function (type, status) {
        $scope.selectTab = type;
        $scope.status = status;
        $scope.keyword = '';
        $scope.fleetName = ''
        $scope.receiptName = ''
        $scope.offset = 0;
        $scope.current_page = 1;
        setSession('payment_tab', type)
        if (type == 0) {
            $scope.get_unMerge_list();
        } else {
            $scope.get_payment_list();
            $scope.pageInit(1);
        }

    }
    //确认付款
    $scope.submit_payment = function (id) {
        if (confirm('是否确认付款？')) {
            APIService.submit_payment(id).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    if ($scope.list.length == 1) {
                        $scope.current_page = $scope.current_page - 1;
                        $scope.offset = $scope.offset - $scope.limit;
                    }
                    layer.msg('确认付款成功！');
                    $scope.get_payment_list();

                } else {
                    isError(res)
                }

            })
        }

    }
    $scope.selectSearch = function (data) {
        $scope.searchName = data.name;
        $scope.searchPlaceHolder = data.text;
        $scope.keywordType = data.id;
    }
    //获取合并售票列表
    $scope.get_unMerge_list = function () {
        APIService.get_unMerge_list($scope.chargeMode, $scope.fleetName, $scope.receiptName, $scope.limit2, $scope.offset).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.unMerge_list_count = res.data.count;
                $scope.list = res.data.items;
                if (res.data.count > $scope.list.length) {
                    $scope.moreOrder = show;
                } else {
                    $scope.moreOrder = hide;
                }
            } else {
                isError(res);
            }
        })
    }
    //确认合并
    $scope.merge = function () {
        console.log($scope.checked)
        var data = {
            orderNo: $scope.checked
        }
        APIService.merge_bill_list(data).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                layer.msg('确认合并收票成功!');
                setTimeout(function () {
                    $scope.select_one = false;
                    $scope.all = false;
                    $scope.checked = [];
                    $scope.tab(1, 'PENDING_PAY');
                }, 1000);
            } else {
                isError(res);
            }
        })
    }
    //加载更多
    $scope.load_more = function () {
        var offset2 = $scope.list.length;
        APIService.get_unMerge_list($scope.chargeMode, $scope.fleetName, $scope.receiptName, $scope.limit2, offset2).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.list = $scope.list.concat(res.data.items);
                angular.forEach(res.data.items, function (i, index) {
                    $scope.checked.push(i.orderNo);
                })
                if (res.data.count > $scope.list.length) {
                    $scope.moreOrder = show;
                } else {
                    $scope.moreOrder = hide;
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.payment_detail = function (orderNo) {
        sessionStorage.setItem('payment_detail_orderNo', orderNo)
    }
    //导出
    $scope.toexcel = function (status, caseNo) {
        if ($scope.searchName == '所属公司') {
            $scope.fleetName = '';
            $scope.receiptName = $scope.keyword;
        } else if ($scope.searchName == '车队名') {
            $scope.fleetName = $scope.keyword;
            $scope.receiptName = '';
        }
        window.open(host + urlV1 + '/order/payment/bill/export' +
            '?fleetName=' + $scope.fleetName + '&receiptName=' + $scope.receiptName + '&$limit=999&BillStatus=PAYED&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }
    //获取收费比例
    $scope.get_service = function () {
        APIService.get_service().then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.service = res.data.object;
            } else {
                isError(res)
            }
        })
    }
    //付款管理查询订单列表
    $scope.get_payment_list = function () {
        APIService.get_payment_list($scope.fleetName, $scope.receiptName, $scope.status, $scope.limit, $scope.offset).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                $scope.count = res.data.count;
                $scope.totlePage = Math.ceil($scope.count / $scope.limit);
                $scope.array = generateArray($scope.totlePage);
                $scope.pageInit($scope.current_page);
            } else {
                isError(res);
            }
        })
    }
    //付款管理查询列表详情
    $scope.get_payment_list_detail = function (id) {
        APIService.get_payment_list_detail(id).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.list2 = res.data.items;
            } else {
                isError(res);
            }
        })
    }
    //修改
    $scope.update = function () {
        $scope.scale = $scope.service;
        $scope.hide_div = false;
    }
    //确认修改
    $scope.update_service = function () {
        if (isNaN($scope.scale) || $scope.scale == '') {
            layer.msg('请输入0到100的整数');
        } else {
            if ($scope.scale >= 100 || $scope.scale < 0) {
                layer.msg('请输入0到100的整数')
            } else {
                var data = {
                    "documentsType": "SYSTEM",
                    "information": "CHARGE_SCALE",
                    "object": $scope.scale,
                }
                APIService.update_service(data).then(function (res) {
                    closeloading();
                    if (res.data.http_status == 200) {
                        layer.msg('修改成功！')
                        $scope.close();
                        $scope.get_service();
                    } else {
                        isError(res);
                    }
                })
            }
        }


    }
    //只允许输入数字
    $scope.isNum = function (e) {
        var preventDefault = function () {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox 
            }
        }
        var k = window.event ? e.keyCode : e.which;
        // if (parseInt($scope.scale) > 100) {
        //     if (k != 46 && k != 8) {
        //         preventDefault();
        //     }

        // }
        if (((k >= 48) && (k <= 57)) || k == 46 || k == 8 || ((k >= 96) && (k <= 105))) {//限制输入数字


        } else {
            preventDefault();
        }
    }

    //关闭弹出框
    $scope.close = function () {
        $scope.hide_div = true;
    }
    $scope.openDiv = function (index, data) {
        if ($scope.openDetail == index) {
            $scope.openDetail = -1;
        } else {
            $scope.openDetail = index;
            $scope.get_payment_list_detail(data.billId);
        }


    }
    //初始化页面时，初始化分页
    $scope.pageInit = function (current_page) {
        $scope.backPage = pageCount;
        $scope.frontPage = 1;
        $scope.current_page = current_page;
        $scope.page($scope.current_page);
    }
    //搜索
    $scope.search = function () {
        if ($scope.searchName == '所属公司') {
            $scope.fleetName = '';
            $scope.receiptName = $scope.keyword;
        } else if ($scope.searchName == '车队名') {
            $scope.fleetName = $scope.keyword;
            $scope.receiptName = '';
        }
        if ($scope.selectTab == 0) {
            $scope.get_unMerge_list();
        } else {
            $scope.get_payment_list();
        }

    }
    //分页
    $scope.page = function (a) {
        //关闭展开的页面
        $scope.openDiv($scope.openDetail, a);
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
    $scope.goPage = function (a) {
        $scope.page(a);
        APIService.get_payment_list($scope.fleetName, $scope.receiptName, $scope.status, $scope.limit, $scope.offset).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                $scope.count = res.data.count;
                $scope.totlePage = Math.ceil($scope.count / $scope.limit);
                $scope.array = generateArray($scope.totlePage);
            } else {
                isError(res);
            }
        })
    }
}])