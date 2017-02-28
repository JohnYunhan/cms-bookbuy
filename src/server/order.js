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
  Freight: {
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
    required: true,
  },
  UpdateDate: {
    type: Number,
    required: true,
  },
  Status: {
    type: Number,
    default: 1
  }, //订单状态,0:已失效、1:待确认、2:配送中、3:已签收、4:审核退款、5:已退款
});

//获取订单列表
Order.statics.getOrderList = function(index, size, json) {
  // console.log(json)
  return new Promise((resolve, reject) => {
    let query = "";
    let total = 0;
    if (json.Nick !== "") {
      //根据会员Id搜索
      query = this.find({ Nick: json.Nick });
      total = this.find({ Nick: json.Nick }).count();
    } else if (json.Status !== null && json.Status !== "") {
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
      if (result) {
        total.exec((err, res) => {
          if (res) {
            resolve({
              Data: result,
              TotalCount: res
            });
          } else {
            reject(err);
          }
        })
      } else {
        reject(error);
      }
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
        reject(error);
      }
    })
  })
}

// 新增订单(确认下单)
Order.statics.addOrder = function(json) {
  return new Promise((resolve, reject) => {
    json.CreateDate = Date.now();
    json.UpdateDate = Date.now();
    json.save((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  })
}

//修改订单
Order.statics.editOrder = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (result) {
        result.BookId = json.BookId;
        result.BookName = json.BookName;
        result.Count = json.Count;
        result.Freight = json.Freight;
        result.Total = json.Total;
        result.Name = json.Name;
        result.Mobile = json.Mobile;
        result.Address = json.Address;
        result.Status = json.Status;
        result.UpdateDate = json.UpdateDate;
        result.save((err, res) => {
          if (res) {
            resolve(res);
          } else {
            reject(err);
          }
        })
      } else {
        reject(error);
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
        }
      } else {
        reject(error);
      }
    })
  })
}

let Orders = mongoose.model('Orders', Order);
module.exports = Orders;
