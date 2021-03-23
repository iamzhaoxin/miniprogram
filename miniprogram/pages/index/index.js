
Page({
  addDate:function(){
      wx.cloud.callFunction({
        name:'insert',
        data:{
          a:3,
          b:4,
        },
        success: function(res) {
          console.log(res.result.sum) 
        },
        fail: console.error
      })
  }

})
