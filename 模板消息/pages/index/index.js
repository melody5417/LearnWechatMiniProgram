//index.js
let getNowtime = require('../../utils/getNowDate.js');
let appId = 'wx83b7a65e7263c008';
let appSecret = '120fe494ccac9b341532bffebbddc59d';

Page({

  data: {

  },

  submitTest(e) {
    let formId = e.detail.formId; //formId 在真机上才能获取
    let accessToken = wx.getStorageSync('access').access_token;
    console.log(wx.getStorageInfoSync('access'))

    let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`;

    let jsonData = {
      touser: wx.getStorageSync('user').openid,
      template_id: 'hpTJSx2ebT4l-K0H2atI9pmBl7QxRKO-rkr3kjl7FaQ',
      form_id: formId,
      page: 'pages/index/index',
      data: {
        "keyword1": {
          "value": "小程序测试模板消息",
          "color": "#444"
        },
        "keyword2": {
          "value": "1000.00元",
          "color": "#444"
        },
        "keyword3": {
          "value": getNowtime.formatTime(new Date()),
          "color": "#444"
        },
        "keyword4": {
          "value": "聚怡花园7-10",
          "color": "#444"
        },
      },
      color: '#ccc',
      emphasis_keyword: 'keyword1.DATA'
    };


    wx.request({
      url: accessTokenUrl,
      data: jsonData,
      method: 'POST',
      success(res) {
        console.log('成功', res);
      },
      fail(err) {
        console.log('失败 ', err);
      }
    })

  },


  onLoad() {
    // 获取 access_token
    let access = wx.getStorageSync('access') || {};
    if (!access.access_token || (access.expires_in && access.expires_in > Date.now())) {
      var access_token_request_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
      wx.request({
        url: access_token_request_url,
        success(res) {
          // 存储access_token
          var obj = {};
          obj.access_token = res.data.access_token;
          obj.expires_in = Date.now() + res.data.expires_in
          wx.setStorageSync('access', obj);
        },
        fail(error) {
          console.log(err);
        }
      })  
    } else {
      console.log(access)
    }

    // 获取 openid  
    let user = wx.getStorageSync('user') || {};
    if (!user.openid || (user.expires_in && user.expires_in > Date.now())) {
      wx.login({
        // 获取 code
        success: function(res) {
          var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${res.code}&grant_type=authorization_code`;
          wx.request({
            url: url,
            data: {},
            method: 'GET',
            success: function(res) {
              // 存储 openid
              var obj = {};
              obj.openid = res.data.openid;
              obj.expires_in = Date.now() + res.data.expires_in;
              wx.setStorageSync('user', obj);
            },
            fail: function(err) {
              console.log(err);
            }
          });
        }
      });
    } else {
      console.log(user);
    }
  }


})