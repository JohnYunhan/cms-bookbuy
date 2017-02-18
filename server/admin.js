/**
 * 管理员
 */
const { createID, encryptJSON, decryptJSON } = require("../utils/utils");
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Admin = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("admin")
  }, //管理员id
  RoleId: {
    type: String,
    required: true,
  }, //角色Id
  Nick: {
    type: String,
    required: true,
    unique: true
  }, //昵称
  Password: {
    type: String,
    required: true,
  },
  Mobile: {
    type: String,
    required: true,
    unique: true,
  },
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

//管理员登录(可根据昵称或手机登录)
Admin.statics.adminLogin = function(json) {
  return new Promise((resolve, reject) => {
    let data = { Nick: json.Nick };
    if (json.Mobile !== "") {
      data = { Mobile: json.Mobile };
    }
    let query = this.findOne(data);
    query.exec((error, result) => {
      if (!error) {
        //找到管理员
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
            reject({ Code: 400, Message: "账号已被拉黑" });
          }
        } else {
          reject({ Code: 400, Message: "账号不存在" });
        }
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//获取管理员列表
Admin.statics.getAdminList = function(json) {
  return new Promise((resolve, reject) => {
    let query = "";
    if (json.Nick !== "") {
      //根据昵称搜索
      query = this.findOne({ Nick: json.Nick })
    } else if (json.Mobile !== "") {
      //根据手机搜索
      query = this.findOne({ Mobile: json.Mobile })
    } else {
      query = this.find();
      query.sort({ UpdateDate: -1 }); //根据添加日期倒序
      query.skip(json.Index * json.Size); //跳过多少个数据
      query.limit(json.Size); //限制Size条数据
    }
    query.exec((error, result) => {
      if (!error) {
        resolve(result);
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

//新增管理员
Admin.statics.addAdmin = function(json) {
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

//根据Id获取管理员
Admin.statics.getAdminById = function(Id) {
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

//修改管理员
Admin.statics.setAdmin = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.RoleId = json.RoleId;
          result.Nick = json.Nick;
          result.Mobile = json.Mobile;
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

//修改管理员密码
Admin.statics.setAdminPassword = function(json) {
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
Admin.statics.setAdminValid = function(json) {
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

let Admins = mongoose.model('Admins', Admin);
module.exports = Admins;
