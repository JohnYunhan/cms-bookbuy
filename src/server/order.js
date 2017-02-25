/**
 * 订单
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Order = mongoose.Schema({
  Id: {
    type: String,
    required: true,
    index: true
  }, //订单id
  BookId: {
    type: String,
    required: true,
  }, //图书Id
  BookName: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  }, //会员Id
  Nick: {
    type: String,
    required: true,
  }, //昵称
  Count: {
    type: Number,
    required: true,
  }, //订单数量
  freight: {
    type: Number,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  }, //订单总额
  Name: {
    type: String,
    default: "",
  }, //收货人
  Mobile: {
    type: String,
    default: "",
  }, //收货人手机
  Address: {
    type: String,
    default: "",
  }, //收货地址
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  },
  Status: {
    type: Number,
    default: 1
  }, //订单状态,0:已失效、1:待确认、2:未发货、3:配送中、4:已签收、5:申请退款、6:退款中、7:已退款
});

//获取订单列表
Order.statics.getOrderList = function(index, size, json) {
  return new Promise((resolve, reject) => {
    let query = "";
    let total = 0;
    if (json.UserId !== "") {
      //根据会员Id搜索
      query = this.find({ UserId: json.UserId });
      total = this.find({ UserId: json.UserId }).count();
    } else if (json.Status !== null) {
      //根据订单状态搜索
      query = this.find({ Status: json.Status })
      total = this.find({ Status: json.Status }).count();
    } else if (json.Id !== "") {
      //根据订单Id搜索
      query = this.find({ Id: json.Id })
      total = this.find({ Id: json.Id }).count();
    } else {
      query = this.find();
      total = this.count();
      query.sort({ UpdateDate: -1 }); //根据添加日期倒序
      query.skip(index * size); //跳过多少个数据
      query.limit(size); //限制Size条数据
    }
    query.exec((error, result) => {
      total.exec((error, res) => {
        if (!error) {
          resolve({
            Data: result,
            TotalCount: res
          });
        } else {
          reject(error);
        }
      })
    })
  })
}

//根据Id获取订单详情
Order.statics.getOrderById = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (result) {
        resolve(result);
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

// 新增订单(确认下单)
Order.statics.addOrder = function(json) {
  return new Promise((resolve, reject) => {
    json.save((error, res) => {
      if (!error) {
        resolve(res);
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//修改订单(未确认下单之前)
Order.statics.setOrder = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.BookId = json.BookId;
          result.Count = json.Count;
          result.Total = json.Total;
          result.Name = json.Name;
          result.Mobile = json.Mobile;
          result.Address = json.Address;
          result.Status = json.Status;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res);
          })
        } else {
          reject(error);
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        }
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//修改订单状态
Order.statics.setOrderStatus = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Status = json.Status;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res); //更新后的数据
          })
        } else {
          reject(error);
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        }
      } else {
        reject(error);
        // reject({ Message: "旧密码不正确", Code: 400 });
      }
    })
  })
}

let Orders = mongoose.model('Orders', Order);
module.exports = Orders;
