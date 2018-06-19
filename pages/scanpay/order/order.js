// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    trade:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      //url: "https://erp.mod-softs.com/wxapi.php",
      url:"http://localhost:909/Youzan/GetYouzanTrade",
      header: {
        "content": "application/x-www-form-urlencoded",
        "content-type":"application/json",
        "Authorization":"bearer TnsoI9f8cou-GEjeaxfx0nvbBsM9swzsKYlBYj29-3nVO8n32breCtcH1emOFVP8YwiZG6iA48uzy20FPUBuPqZSbsfWjoV1sWrAI1diD-ypSX9wIW9KOykdd1Efyb5T_Xpo_Quj5fGmP8Q_oHqrbgP2EdEih-DXg7dvhRML7N2I5rbigLbpZKobC4TFy8XYgn3k9GQHSPOM2R4sB1DFP0EQydCanCdmNkP_Sf7UUdoLdjvHxw3KaYNO0RgCQ6LpSB_ASff2B_dWQXnG7idR0KXNvmHjnraa1yFhuZA6DgM43d6Zlt2Knikozny-mSo2QKwh6Iq3emuZXidZovc6O1LmpdYcHjHHxBFA9gmnDH0V1Oa9oLi9PGEjKGQPomlb7iZoI63fhlUq7sURAaIeI9eCULtV1qpmfVvxR6oITkaW-Izgf1ZSGC1eDhg0kIyzYi5qUDquTnzSkXiD91AVLkEtFS1H6pa5B-b5GQ9ciZA"
      },
      method: "get",
      data: {
         tid: "E20180112175858062300009" 
         },
      complete: function (res) {



        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }

        that.setData({
          list: res.data.Data.response.trade,  // 订单列表
          trade: res.data.Data.response.trade
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})