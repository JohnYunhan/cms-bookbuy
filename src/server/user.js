/**
 * 会员
 */
const { createID, encryptJSON, decryptJSON } = require("../utils/utils");
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let User = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("user")
  }, //会员id
  Nick: {
    type: String,
    required: true,
  }, //昵称
  Password: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    default: "",
  }, //姓名（收货人）
  Mobile: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    default: "",
  }, //邮箱
  Address: {
    type: String,
    default: "",
  }, //收货地址
  Level: {
    type: Number,
    default: 1,
  }, //会员等级,1:注册会员、2:铜牌会员、3:银牌会员、4:金牌会员、5:钻石会员,//确认订单次数达至(5、15、35、65、105)可升级    
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  },
  Valid: {
    type: Boolean,
    default: true
  }, //账号是否可以使用
});

//会员登录(可根据昵称或手机登录)
User.statics.userLogin = function(json) {
  return new Promise((resolve, reject) => {
    let data = {};
    if (json.Mobile != "") {
      data = { Mobile: json.Mobile };
    } else {
      data = { Nick: json.Nick }
    }
    let query = this.findOne(data);
    query.exec((error, result) => {
      if (!error) {
        //找到会员
        if (result) {
          if (result.Valid) {
            decryptJSON(json.Password, result.Password).then(pass => {
              if (pass) {
                //密码正确
                resolve(result);
              } else {
                reject({ Code: 400, Message: "密码错误" });
              }
            })
          } else {
            reject({ Code: 401, Message: "抱歉，由于您近期违规操作较多，账号已被拉黑" });
          }
        } else {
          reject({ Code: 400, Message: "账号不存在" });
        }
      } else {
        reject(error)
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//获取会员列表
User.statics.getUserList = function(json, index, size) {
  return new Promise((resolve, reject) => {
    let query = "";
    let total = 0;
    if (json.Nick !== "") {
      //根据昵称搜索
      let nick = new RegExp(json.Nick); //创建正则表达式
      query = this.find({ Nick: { $regex: nick } });
      total = this.find({ Nick: { $regex: nick } }).count();
    } else if (json.Mobile !== "") {
      //根据手机搜索
      let mobile = new RegExp(json.Mobile);
      query = this.find({ Mobile: { $regex: mobile } });
      total = this.find({ Mobile: { $regex: mobile } }).count();
    } else {
      query = this.find();
      total = this.count();
      query.sort({ UpdateDate: -1 }); //根据添加日期倒序
      query.skip(index * size); //跳过多少条数据
      query.limit(size); //获取多少条数据
    }
    query.exec((error, result) => {
      total.exec((error, res) => {
        if (!error) {
          resolve({
            Data: result,
            TotalCount: res
          });
        } else {
          // reject(error);
          reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        }
      });
    })
  })
}

//根据Id获取会员
User.statics.getUserById = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        // reject(error);
      }
    })
  })
}

// 新增会员
User.statics.addUser = function(json) {
  return new Promise((resolve, reject) => {
    encryptJSON(json.Password).then(result => {
      json.Password = result;
      json.save((error, res) => {
        if (!error) {
          resolve(res); //新增的数据
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      })
    })
  })
}

//修改会员
User.statics.setUser = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Nick = json.Nick;
          result.Name = json.Name;
          result.Mobile = json.Mobile;
          result.Email = json.Email;
          result.Address = json.Address;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res); //更新后的数据
          })
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

//修改会员密码
User.statics.setUserPassword = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id, Password: json.OldPassword });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Password = json.NewPassword;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res); //更新后的数据
          })
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      } else {
        // reject({ Message: "旧密码不正确", Code: 400 });
        reject(error);
      }
    })
  })
}

//加入或解除黑名单
User.statics.setUserValid = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Valid = json.Valid;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res); //更新后的数据
          })
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

//会员升级
User.statics.userUpgrade = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Level = json.Level;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res); //更新后的数据
          })
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

let Users = mongoose.model('Users', User);
module.exports = Users;
