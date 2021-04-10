// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
const db = cloud.database()
const MAX_LIMIT = 100
const collections = db.collection('user')
const _ = db.command  
  var firstdate = event.firstdate;   // 前端调用云函数时传入的时间参数，用来取对应区间里的账单数据
  var lastdate = event.lastdate;
  const countResult = await collections.where({
    _openid: wxContext.OPENID,      // 这里需要注意，写数据的时候，会自动为我们添加用户的openid，可是读取的时候，需要自己把这个限制条件加上去。
    data: {
      date: _.and(_.gte(firstdate), _.lte(lastdate))  
    }
  }).count()       // 获取该区间段所有的账单总数
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = collections.where({
      _openid: wxContext.OPENID,
      data: {
        date: _.and(_.gte(firstdate), _.lte(lastdate))
      }
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}