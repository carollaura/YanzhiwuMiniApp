
//获取应用实例
const app = getApp()
Page({
  data: {
    carts: getApp().data.carts,               // 购物车列表
    hasList: getApp().data.hasList,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    saoyisao: false,    // 是否能扫码
    obj: {
      name: "hello"
    },
    prodSeriNoHidden: true//是否隐藏产品序列号输入框
  },
  scanBarCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        var goodsNo = res.result;
        wx.request({
          url: "http://api.yanzhiwu.com/Youzan/GetYouzanTrade",
          header: {
            "content": "application/x-www-form-urlencoded",
            "Content-Type": "application/json",
            "Authorization": "bearer " + app.globalData.aToken,
          },
          method: "get",
          data: { "tid": "E20170724195026037555445" },
          complete: function (res) {

            if (res == null || res.data == null) {
              console.error('网络请求失败');
              that.setData({
                count: 1500,
                toastText: '网络请求失败',
                isShowToast: true
              });
              that.showToast();
              return;
            }
            if (res.data.IsSuccessful != true) {
              that.setData({
                count: 1500,
                toastText: '没有找到该商品',
                isShowToast: true
              });
              that.showToast();
              return;
            }
            getApp().data.goodsNo = goodsNo

            for (var i = 0; i < getApp().data.carts.length; i++) {
              if (getApp().data.carts[i].id == goodsNo) {
                getApp().data.carts[i].num = getApp().data.carts[i].num + 1;
                wx.showToast({
                  title: '已添加购物车',
                  icon: 'success',
                  duration: 2000
                })
                return;
              }
            }

            //保存商品编码，全局变量
            var newarray = [
              {
                id: res.data.Data.response.trade.tid,
                title: res.data.Data.response.trade.title,
                image: res.data.Data.response.trade.pic_path,
                num: 1,
                price: res.data.Data.response.trade.price,
                selected: true,
                customerNo: res.data.Data.response.trade.tid,
                goodsNo: goodsNo
              }
            ]
            getApp().data.carts = getApp().data.carts.concat(newarray);
            getApp().data.hasList = true
            wx.showToast({
              title: '已添加购物车',
              icon: 'success',
              duration: 2000
            })

            that.setData({
              carts: getApp().data.carts,
              hasList: getApp().data.hasList
            });
            that.getTotalPrice();

          }
        })


      },
      fail: function (res) {
      }
    })


  },
  pay: function () {
    var that = this
    var m = that.data.totalPrice;
    var arr = [
      {
        userId: getApp().data.openId
      },
      {
        goodsAmount: m
      },
      {
        carts: getApp().data.carts
      }
    ]
    var json = JSON.stringify(arr);
    wx.request({
      url: "https://erp.mod-softs.com/wxapi.php",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { fun: "addOrder", json: json },
      success: function (response) {
        console.log(response.data);
        // 发起支付  
        wx.requestPayment({
          'appId': response.data.appId,
          'timeStamp': response.data.timeStamp,
          'nonceStr': response.data.nonceStr,
          'package': response.data.package,
          'signType': 'MD5',
          'paySign': response.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功'
            });
            wx.request({
              url: "https://erp.mod-softs.com/wxapi.php?Notify=1",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              data: { paySign: response.data.paySign },
              success: function (r) {

              }
            });
            getApp().data.carts = []
            getApp().data.hasList = false
            that.setData({
              carts: getApp().data.carts,               // 购物车列表
              hasList: getApp().data.hasList
            });
            that.getTotalPrice();
            console.log(res);
          },
          'fail': function (res) {
            console.log(res)
          }
        });
      }
    })
    //wx.showModal({
    // title: '支付提示',
    // content: m+'元',
    // success: function (res) {
    //   if (res.confirm) {

    //     wx.request({
    //       url: "https://erp.mod-softs.com/wxapi.php",
    //       header: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //       },
    //       method: "POST",
    //       data: { fun: "addOrder", json: json},
    //       complete: function (res) {

    //         wx.showToast({
    //           title: "支付成功",
    //           icon: 'success',
    //           duration: 2000
    //         })

    //         if (res == null || res.data == null) {
    //           console.error('网络请求失败');
    //           that.setData({
    //             count: 1500,
    //             toastText: '网络请求失败',
    //             isShowToast: true
    //           });
    //           that.showToast();
    //           return;
    //         }
    //       }
    //     })
    //     getApp().data.carts = []
    //     getApp().data.hasList = false
    //     that.setData({
    //       carts: getApp().data.carts,               // 购物车列表
    //       hasList: getApp().data.hasList
    //     });
    //     that.getTotalPrice();
    //     console.log('用户点击确定')
    //   }
    // }

    //})


  },
  onShow() {
    this.setData({
      carts: getApp().data.carts,               // 购物车列表
      hasList: getApp().data.hasList,
      saoyisao: getApp().data.cartsao,
    });
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = getApp().data.carts;
    carts.splice(index, 1);
    getApp().data.carts = carts;
    this.setData({
      carts: getApp().data.carts
    });
    if (!carts.length) {
      getApp().data.hasList = false
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = getApp().data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    getApp().data.carts = carts;
    this.setData({
      carts: getApp().data.carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = getApp().data.carts
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    getApp().data.carts = carts
    this.setData({
      carts: getApp().data.carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  //事件处理函数  
  bindViewTap: function () {
    this.setData({
      prodSeriNoHidden: !this.data.prodSeriNoHidden
    })

  },
  //确定按钮点击事件  
  modalBindaconfirm: function () {
    this.setData({
      prodSeriNoHidden: !this.data.prodSeriNoHidden,
    })
  },
  //取消按钮点击事件  
  modalBindcancel: function () {
    this.setData({
      prodSeriNoHidden: !this.data.prodSeriNoHidden,
    })
  }

})
// 可以使用的支付代码
// wx.request({
//   url: 'https://erp.mod-softs.com/pay.php',
//   header: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   data: {
//     code: getApp().data.openId,
//   },
//   method: 'POST',
//   success: function (response) {
//     console.log(response.data);
//     // 发起支付  
//     wx.requestPayment({
//       'appId': response.data.appId,
//       'timeStamp': response.data.timeStamp,
//       'nonceStr': response.data.nonceStr,
//       'package': response.data.package,
//       'signType': 'MD5',
//       'paySign': response.data.paySign,
//       'success': function (res) {
//         wx.showToast({
//           title: '支付成功'
//         });
//         console.log(res);
//       },
//       'fail': function (res) {
//         console.log(res)
//       }
//     });
//   }
// })