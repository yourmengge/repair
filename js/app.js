var settle = angular.module('settle', ['ui.router', 'Road167', 'login', 'main', 'message', 'orderlist', 'shop4smsg', 'damage', 'component', 'fitting']);
settle.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '../view/login.html'
        })
        .state('main', {
            url: '/main',
            templateUrl: '../view/main.html'
        })
        .state('main.message', {
            url: '/message',
            templateUrl: '../view/message.html'
        })
        .state('main.orderlist', {
            url: '/orderlist',
            templateUrl: '../view/orderlist.html'
        })
        .state('main.shop4smsg', {
            url: '/shop4smsg',
            templateUrl: '../view/shop4smsg.html'
        })
        .state('main.damage', {
            url: '/damage',
            templateUrl: '../view/damage.html'
        })
        .state('main.fitting', {
            url: '/fitting',
            templateUrl: '../view/fitting.html'
        })
        .state('main.component', {
            url: '/component',
            templateUrl: '../view/component.html'
        })
        .state('main.payment', {
            url: '/payment',
            templateUrl: 'view/payment.html'
        })
        .state('main.receipt.settlement', {
            url: '/settlement',
            templateUrl: 'view/settlement.html'
        })
        .state('main.payment.settlement', {
            url: '/settlement',
            templateUrl: 'view/settlement.html'
        })
        .state('main.receipt.auth', {
            url: '/auth',
            templateUrl: 'view/authorization.html'
        })
        .state('main.receipt.takePhoto', {
            url: '/takePhoto',
            templateUrl: 'view/takePhoto.html'
        })
        .state('main.receipt.batch', {
            url: '/batch',
            templateUrl: 'view/batch.html'
        })
        .state('main.receipt.orderDetail', {
            url: '/orderDetail',
            templateUrl: 'view/orderDetail.html'
        })
})
function isError(err) {
    if (err.data.http_code == 'token.error' || err.data.http_code == 'userId.head.illeagl') {
        layer.msg('您的账号在别处登录，请重新登录');
        setTimeout(function () {
            closeloading();
            goto_view('login');

        }, 2000);
    }
    if (err.data.http_status == 400 || err.data.http_status == 403) {
        layer.msg(err.data.message);
        closeloading();
    }
    if (err.data.http_status >= 500) {
        layer.msg('网络出现问题了，请刷新重试');
        closeloading();
    }
}
function getString(url) {
    var type = url.split('=');
    return type[1];
}
function goto_view(v) {
    var baseUrl = window.location.href;
    //window.location.reload();
    baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
    window.location.href = baseUrl + "#!/" + v;
    return { 'a': 1, b: 2 };
}
function ToLocalTime(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var nowtime = y + '-' + add0(m) + '-' + add0(d);
    return nowtime;
}
function add0(m) {
    return m < 10 ? '0' + m : m
}
function setSession(name, data) {
    sessionStorage.setItem(name, data)
}
function getSession(name) {
    return sessionStorage.getItem(name)
}
function removeSession(name) {
    sessionStorage.removeItem(name)
}
settle.filter('ToDay', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var nowtime = y + '-' + add0(m) + '-' + add0(d);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});
settle.filter('ToFormat', function () {
    function add0(m) {
        return m < 10 ? '0' + m : m
    }

    function ToLocal(shijianchuo) {
        if (shijianchuo == null) {
            return null;
        } else {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '年' + add0(m) + '月' + add0(d) + '日';
            return nowtime;
        }
    }
    return ToLocal;
})
settle.filter('ToTime', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});
settle.filter('Price', function () {
    function Price(value) {
        if (value == 0) {
            return 0;
        } else {
            return (value / 100).toFixed(2);
        }
    }
    return Price;
})
settle.filter('gongli', function () {
    function Price(value) {
        if (value == 0) {
            return 0;
        } else {
            return (value / 1000).toFixed(1);
        }
    }
    return Price;
})
settle.filter('ToLocal', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }

    }
    return ToLocal;
});
function contains(e, d) {
    for (var i = 0; i < e.length; i++) {
        if (d == e[i]) {
            return true;
        }
    }
}
var index;
function loading() {
    index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}
function closeloading() {
    layer.close(index);
}
function generateArray(num) {
    var array = [];
    for (var i = 1; i <= num; i++) {
        array.push(i);
    }
    return array;
}
var isNum = function (e) {//限制输入0到100的正整数
    var preventDefault = function () {
        if (window.event) {
            window.event.returnValue = false;
        }
        else {
            e.preventDefault(); //for firefox 
        }
    }
    var k = window.event ? e.keyCode : e.which;
    if (((k >= 48) && (k <= 57)) || k == 46 || k == 8 || ((k >= 96) && (k <= 105))) {//限制输入数字


    } else {
        preventDefault();
    }
}
