// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //要指定环境，不然默认使用第一个创建的环境，那就糟糕了……
  env: 'mini-program-8gduw4z9cd88bd53',
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('test').add({
      data:{
        money: event.money,
      }
    })
    return event.money*2
  } catch (e) {
    console.log(e)
  }
  // return {
  //   sum: parseFloat(event.money)*2
  // }
}