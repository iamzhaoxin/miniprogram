Page({
  //设置初始化时要渲染的数据
  data: {
    money: '',
    output: '',
  },
  //获取input的值（相应bindinput='get_money'）
  get_money(e) {
    this.setData({
      money: e.detail.value,
    })
  },
  //调用云函数
  addData: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'insert',
      data: {
        money: this.data.money,
      },
      success: function (res) {
        console.log(res.result)
        that.setData({
          output: res.result
        })
      },
      fail: console.error
    })
  }

})