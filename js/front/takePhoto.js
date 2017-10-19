var takePhoto = angular.module('takePhoto', ['Road167']);
var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');//随机数  
var code = 'a/';
var picPathName = '';
takePhoto.controller('takePhotoCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.flag = 0;
        $scope.hasNewPic = false;
        closeloading();
        $scope.orderNo = sessionStorage.getItem('payment_detail_orderNo');
        $scope.settleStatus = '';
        $scope.remark = '';
        $scope.guid = 0;
        $scope.thumb = {};      //用于存放图片的base64
        $scope.pic = {};
        $scope.picLength = 0;
        $scope.ignoreIds = [];
        $scope.get_pic();

    }
    $scope.pic_count = 0;
    //获取发票照片
    $scope.get_pic = function () {
        APIService.get_pic($scope.orderNo).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.settleStatus = res.data.settleStatus;
                $scope.remark = res.data.remark;
                if ($scope.settleStatus == 423) {
                    $scope.message = '审核不通过：' + $scope.remark;
                } else if ($scope.settleStatus == 422) {
                    $scope.message = '审核中'
                }
                $scope.totle_pic_count = res.data.items.length;
                $scope.pic_count = res.data.items.length;
                for (let i in res.data.items) {
                    $scope.thumb[i] = {
                        imgSrc: res.data.items[i].path,
                        id: res.data.items[i].id,
                        index: ''
                    }
                    $scope.guid++;
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

    $scope.getPicPathName = function (codeLength) {
        for (var i = 0; i < codeLength; i++) {//循环操作  
            var index = Math.floor(Math.random() * 52);//取得随机数的索引（0~35）  
            code += random[index];//根据索引取得随机数加到code上  
        }
        picPathName = code + '.jpg';
        code = 'a/';
        return picPathName;
    }




    $scope.img_upload = function (files) {       //单次提交图片的函数
        if (files.length != 0) {
            if (files.length > 2 || files.length + $scope.pic_count > 2) {
                layer.msg('最多只能上传两张图片')
            } else {
                for (let i = 0; i < files.length; i++) {
                    $scope.reader = new FileReader();   //创建一个FileReader接口
                    // $scope.guid = (new Date()).valueOf() + '';   //通过时间戳创建一个随机数，作为键名使用

                    console.log($scope.guid)
                    $scope.reader.readAsDataURL(files[i]);  //FileReader的方法，把图片转成base64
                    $scope.reader.onload = function (ev) {
                        $scope.$apply(function () {
                            $scope.thumb[$scope.guid] = {
                                imgSrc: ev.target.result,  //接收base64
                                id: '',
                                index: $scope.guid
                            }
                            $scope.pic[$scope.guid] = {
                                file: files[i]
                            }
                            $scope.guid++;
                            $scope.pic_count++;
                            document.getElementById('photo').value = ''
                        });
                    };
                }
            }
        }
    };
    $scope.img_del = function (key, item) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
        var guidArr = [];
        for (var p in $scope.thumb) {
            guidArr.push(p);
        }
        if ($scope.settleStatus == 414 || $scope.settleStatus == 416) {//未开票状态，无需考虑已存在的照片

            delete $scope.pic[guidArr[key]];
            delete $scope.thumb[guidArr[key]];
            $scope.pic_count--;
        } else { //审核不通过状态下，考虑已存在的照片
            if (item.id == '') {//删除未提交的图片
                delete $scope.pic[guidArr[key]];
                delete $scope.thumb[guidArr[key]];
                $scope.pic_count--;
            } else {//删除之前上传的图片
                delete $scope.thumb[guidArr[key]];
                $scope.pic_count--;
            }
        }
    };
    //提交发票
    $scope.submit = function () {
        console.log($scope.pic)
        if (confirm('确认是否上传该发票？')) {
            if ($scope.settleStatus == 423) {
                $scope.upload_second();
            } else {
                $scope.upload_first();
            }

        }
    }
    $scope.upload = function (array) {
        var path = [];
        APIService.get_oss().then(function (res) {
            if (res.data.http_status == 200) {
                $scope.ossRes = res.data;
                for (let i in $scope.pic) {
                    var client = new OSS.Wrapper({
                        region: 'oss-cn-hangzhou',
                        accessKeyId: $scope.ossRes.accessKeyId,
                        accessKeySecret: $scope.ossRes.accessKeySecret,
                        bucket: $scope.ossRes.bucketName,
                        stsToken: $scope.ossRes.securityToken,
                        secure: true
                    });
                    $scope.picLength++;
                    console.log($scope.pic[i])
                    bucket = $scope.ossRes.bucketName;
                    client.multipartUpload($scope.getPicPathName(32), $scope.pic[i].file).then(function (result) {
                        path.push(result.name);

                        if (path.length == $scope.picLength) {
                            closeloading();
                            var data = {
                                "type": "5",
                                "paths": path,
                                "orderNo": $scope.orderNo,
                                'ignoreIds': array
                            }
                            APIService.upload_invoice(data).then(function (res) {
                                closeloading();
                                if (res.data.http_status == 200) {
                                    layer.msg('发票提交成功');
                                    setTimeout(function () {
                                        location.reload();
                                    }, 1000);
                                } else {
                                    isError(res);
                                }
                            })
                        }

                    })
                }
            }

        });
    }
    $scope.upload_first = function () {
        $scope.upload();
    }
    $scope.upload_second = function () {
        for (let i in $scope.thumb) {
            if ($scope.thumb[i].id != '') {//判断Id是否为空，不为空则表示之前上传的照片
                $scope.ignoreIds.push($scope.thumb[i].id)
            } else {
                $scope.hasNewPic = true;
            }
        }
        if (!$scope.hasNewPic) {
            var data = {
                "type": "5",
                "paths": [],
                "orderNo": $scope.orderNo,
                'ignoreIds': $scope.ignoreIds
            }
            APIService.upload_invoice(data).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('发票提交成功');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    isError(res);
                }
            })
        } else {
            $scope.upload($scope.ignoreIds)

        }

    }
}])