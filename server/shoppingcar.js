/**
 * 购物车
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Car = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("car")
  }, //订单id
  BookId: {
    type: Array,
    required: true,
  }, //图书Id
  UserId: {
    type: String,
    required: true,
  }, //会员Id
  Count: {
    type: Array,
    required: true,
  }, //数量
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  }
});

//获取购物车列表
Car.statics.getCarList = function(json) {
  return new Promise((resolve, reject) => {
    let query = "";
    if (json.UserId !== "") {
      //根据会员Id搜索
      query = this.find({ UserId: json.UserId })
    } else {
      query = this.find();
      query.sort({ UpdateDate: -1 }); //根据日期倒序
      query.skip(json.Index * json.Size); //跳过多少个数据
      query.limit(json.Size); //限制Size条数据
    }
    query.exec((error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//根据Id获取购物车
Car.statics.getCarById = function(Id) {
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

//新增购物车
Car.statics.addCar = function(json) {
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

//修改购物车
Car.statics.setCar = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.BookId = json.BookId;
          result.Count = json.Count;
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

//删除购物车
Car.statics.delCar = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (!error) {
        result.remove((err, res) => {
          if (!err) {
            resolve(res);
          } else {
            reject(err)
          }
        })
      } else {
        reject(error);
      }
    })
  })
}

let Cars = mongoose.model('Cars', Car);
module.exports = Cars;
