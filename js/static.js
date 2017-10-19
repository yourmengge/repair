var
//     host = 'https://dev.road167.com/extrication';
// url = 'https://dev.road167.com';
// host = 'http://dev.road167.com/extrication';
// url = 'http://localhost:8080';
host = 'https://t.road167.com/extrication';
url = 'https://t.road167.com';
// host = 'http://www.road167.com/extrication';
// url = 'http://www.road167.com';
urlOrder = '/order';
urlV1 = '/v1';
urlUser = '/user';
urlLogin = '/login';
urlAction = '/action';
urlToken = '/token';
urlActions = '/actions';
third = '/third';
urlFleet = '/fleet';
show = 0;
hide = 1;
urlDriver = '/driver';
limit = 10;
offset = 0;
pageCount = 5;//分页时，显示多少页
fav_driver = '/fav-driver';
fav_address = '/fav-address';
isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
urlAdd = '/add';
order_eval = '/order-eval';
urlAssigndrivers = '/assigndrivers';
urlTrack1 = '/proxy/baidu/map/trace/gethistory?start_time=';
urlTrack2 = '&end_time=';
urlTrack3 = '&entity_name=';
urlTrack4 = '&page_size=5000&is_processed=1&simple_return=0&supplement_mode=driving&process_option=[need_denoise=1,need_vacuate=1,need_mapmatch=1,transport_mode=1]'
isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
urlSpecify_fleet = '/specify-fleet';
token = '';
userId = ''
urlTrack5 = '/baidu/map/trace/entity/list?disasterId=';
urlKey = '&key=';
urlTaskStatus = '&TaskStatus=';
urlDisaster = '/disaster/page';
urlDisasterAddress = '/disaster-address'
var filter = {
    status: '',
    keyword: '',
    startDate: '',
    endDate: '',
    status2: '',
    order_current: '',
    shop_current: '',
    ordertype: ''
}
var shop4s_filter = {
    keyword: '',
    shop4s_current: ''
}
var disaster_filter = {
    startDay: '',
    status: '',
    keyword: '',
    disaster_current: ''
}