const app = getApp();


Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showModal({
        title: 'tips',
        content: 'phone number and password should not be blank'
        //  duration: 2000
      })
    } else {
      wx.request({
        url: "http://localhost:909/token",//"http://api.yanzhiwu.com/token",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "password",//"client_credentials",
          username: this.data.phone,
          password: this.data.password,
          client_id: '09050613',
          client_secret: 'ED75F81712754751A1CAFBBCD7CF6650'
        },
        method: "post",
        success: function (res) {
          if (res.data.access_token) {//成功获取到token
            app.globalData.aToken = res.data.access_token;
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.switchTab({
                    url: '/pages/scanpay/index/index'
                  })
                }, 2000) //延迟时间
              }
            })
          }else{
            wx.showModal({
              title: 'tips',
              content: res.data.error_description,
            })
          }
        },

        fail: function (data) {
          console.log(data);
        }
      })
      // wx.request({
      //   url: "http://api.yanzhiwu.com/Youzan/GetYouzanTrade",
      //   header: {
      //     "content": "application/x-www-form-urlencoded",
      //     "content-type": "application/json",
      //     "Authorization": "bearer TnsoI9f8cou-GEjeaxfx0nvbBsM9swzsKYlBYj29-3nVO8n32breCtcH1emOFVP8YwiZG6iA48uzy20FPUBuPqZSbsfWjoV1sWrAI1diD-ypSX9wIW9KOykdd1Efyb5T_Xpo_Quj5fGmP8Q_oHqrbgP2EdEih-DXg7dvhRML7N2I5rbigLbpZKobC4TFy8XYgn3k9GQHSPOM2R4sB1DFP0EQydCanCdmNkP_Sf7UUdoLdjvHxw3KaYNO0RgCQ6LpSB_ASff2B_dWQXnG7idR0KXNvmHjnraa1yFhuZA6DgM43d6Zlt2Knikozny-mSo2QKwh6Iq3emuZXidZovc6O1LmpdYcHjHHxBFA9gmnDH0V1Oa9oLi9PGEjKGQPomlb7iZoI63fhlUq7sURAaIeI9eCULtV1qpmfVvxR6oITkaW-Izgf1ZSGC1eDhg0kIyzYi5qUDquTnzSkXiD91AVLkEtFS1H6pa5B-b5GQ9ciZA"
      //   },
      //   method: "get",
      //   data: {
      //     tid: "E20180112175858062300009"
      //   },
      //   complete: function (res) {
      //   }
      // })

    }
  }
})