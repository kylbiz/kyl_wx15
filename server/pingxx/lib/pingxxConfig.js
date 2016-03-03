var HOST = 'http://wx15.kyl.biz'
PingxxConfig = {
  'host': HOST,
  // 'host': 'http://127.0.0.1:3000',
  'app_id': 'app_f5mvD8rbXLmT5O4e',
  'channel': ['alipay_wap'],
  'charge_url': HOST + '/pingxx/createCharge',
  // 'api_key': 'sk_test_yv9Ou50O4qX5ujXLC494yvL8', // test
  'api_key': 'sk_live_bLm1WHjrrDOGOqTiz1zTm1KG', // live
  'success_path': '/pay_result/pingxx',
  'create_charge_path': '/pingxx/createCharge',
  'hook_path': '/pingxx/hook',
}
