var Road167 = angular.module('Road167', []);
Road167.factory('APIService', function ($http) {
    var service = {
        token: sessionStorage.getItem('token'),
        userId: sessionStorage.getItem('userId')
    }
    service.get = function (url) {
        loading();
        return $http({
            method: 'GET',
            url: url,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })

    };
    service.post = function (url, data) {
        loading();
        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    service.put = function (url, data) {
        loading();
        return $http({
            method: 'PUT',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    service.patch = function (url, data) {
        loading();
        return $http({
            method: 'PATCH',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };

    service.delete = function (url) {
        loading();
        return $http({
            method: 'DELETE',
            url: url,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    //退出登录
    service.user_logout = function () {
        return service.delete(host + urlV1 + urlUser + urlActions + '/loginout');
    }
    //获取开票列表


    //付款管理查询订单列表
    service.get_payment_list = function (fleetName, receiptName, status, limit, offset) {
        return service.get(host + urlV1 + '/order/payment?fleetName=' + fleetName + '&receiptName=' + receiptName + '&BillStatus=' + status + '&$limit=' + limit + '&$offset=' + offset)
    }
    //付款管理查询订单列表详情
    service.get_payment_list_detail = function (id) {
        return service.get(host + urlV1 + '/order/payment/bill/' + id + '?$limit=200&$offset=0')
    }

    //获取服务比例
    service.get_service = function () {
        return service.post(host + urlV1 + '/documents/find-one', { documentsType: 'SYSTEM', information: "CHARGE_SCALE" })
    }

    //更新服务费
    service.update_service = function (data) {
        return service.patch(host + urlV1 + '/documents/update', data);
    }

    //付款管理
    service.get_recepit_list = function (startDay, endDay, status, companyName, receiptName, carNo, orderNo, chargeMode, limit, offset) {
        return service.get(host + urlV1 + '/order/payment/bill?startDay=' + startDay + '&endDay=' + endDay + '&BillStatus=' + status + '&companyName=' + companyName + '&receiptName=' + receiptName + '&carNo=' + carNo + '&chargeMode=' + chargeMode + '&orderNo=' + orderNo + '&$limit=' + limit + '&$offset=' + offset)
    }

    //提交匹配
    service.confirm_batch = function (key) {
        return service.post(host + urlV1 + '/order/income/import/confirm/' + key, { '': '' })
    }

    //查询未匹配收款记录
    service.get_unmatch_list = function () {
        return service.get(host + urlV1 + '/order/income/unmatched');
    }

    //上传图片,获取oss权限
    service.get_oss = function () {
        return service.get(host + '/v1/aliyun/oss/sts/get-put');
    }
    //获取发票照片
    service.get_pic = function (orderNo) {
        return service.get(host + urlV1 + '/picture/' + orderNo + '?pictureType=BILL')
    }
    //删除文件
    service.delete_file = function (id) {
        return service.patch(host + urlV1 + '/order/income/delete/' + id, { '': '' })
    }

    //删除订单明细
    service.delete_order_detail = function (orderId) {
        return service.patch(host + urlV1 + '/order/income/delete/detail/' + orderId)
    }

    //查询结算详情
    service.get_payment_detail = function (orderNo) {
        return service.get(host + urlV1 + '/order/' + orderNo + '/bill/detail')
    }

    //查询订单详情
    service.get_order_detail = function (orderNo) {
        return service.get(host + urlV1 + '/order/' + orderNo + '/detail?bVerifyAddress=true')
    }

    //上传照片
    service.upload_fee = function (data) {
        return service.post(host + urlV1 + '/picture/oss', data)
    }

    //查询某车牌未匹配的订单列表
    service.get_carNo_unmatch_list = function (carNo) {
        return service.get(host + urlV1 + '/order/income/pending-confirm?carNo=' + carNo)
    }
    //查询授权信息
    service.get_auth_detail = function (orderNo) {
        return service.post(host + urlV1 + '/order/authorization', { orderNo: orderNo })
    }
    //查询合并收票列表
    service.get_unMerge_list = function (chargeMode, fleetName, receiptName, limit, offset) {
        return service.get(host + urlV1 + '/order/payment/bill?chargeMode=' + chargeMode + '&BillStatus=UN_MERGE&fleetName=' + fleetName + '&receiptName=' + receiptName + '&$limit=' + limit + '&$offset=' + offset)
    }
    //确认付款
    service.submit_payment = function (id) {
        return service.patch(host + urlV1 + '/order/payment/payed/' + id)
    }
    //批量确认收款
    service.batch_receipt = function (array) {
        return service.patch(host + urlV1 + '/order/income/manual/confirm?' + array)
    }
    //合并开票
    service.merge_bill_list = function (data) {
        return service.post(host + urlV1 + '/order/payment/bill', data)
    }
    //提交发票
    service.upload_invoice = function (data) {
        return service.post(host + urlV1 + '/picture/oss', data)
    }
    //匹配订单
    service.match_order = function (data) {
        return service.post(host + urlV1 + '/order/income/manual/confirm', data)
    }
    //退出登录
    service.logout = function () {
        return service.delete(host + urlV1 + '/user/actions/loginout', { '': '' })
    }
    //登录
    service.login = function (phone, password) {
        var password = hex_md5(password);
        var data = {
            password: password,
            phone: phone,
            roleId: 20
        };
        return $http.post(host + urlLogin + urlAction + urlToken, data).then(function (res) {
            if (res.data.http_status == 200) {
                service.userId = res.data.userId;
                service.token = res.data.token;
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('userId', res.data.userId);
                return res;
            } else {
                return res;
            }
        });
    };

    return service;
})
Road167.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {
        "Content-Type": 'application/json'
    };
    $httpProvider.defaults.transformRequest = function (value) {
        return JSON.stringify(value);
    };
});