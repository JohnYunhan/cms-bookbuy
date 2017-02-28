/**
 * 管理员
 */
const { encryptJSON, decryptJSON } = require("../utils/utils");
var { AuthCookie } = require("./authority");
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Admin = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    // default: uniqid("admin")
  }, //管理员id
  RoleId: {
    type: String,
    // required: true,
    default: "",
  }, //角色Id
  RoleName: {
    type: String,
    // required: true,
    default: "",
  }, //角色名称 
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
    required: true,
  },
  UpdateDate: {
    type: Number,
    required: true,
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
    })
  })
}

//获取管理员列表
Admin.statics.getAdminList = function(json, index, size) {
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
      query.skip(index * size); //跳过多少个数据
      query.limit(size); //限制size条数据
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

//新增管理员
Admin.statics.addAdmin = function(json) {
  return new Promise((resolve, reject) => {
    json.Id = uniqid("admin");
    json.CreateDate = Date.now();
    json.UpdateDate = Date.now();
    encryptJSON(json.Password).then(result => {
      if (result) {
        json.Password = result;
        json.save((err, res) => {
          if (res) {
            resolve(res); //新增的数据
          } else {
            reject(err);
          }
        })
      }
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
        reject(error);
      }
    })
  })
}

//修改管理员
Admin.statics.editAdmin = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (result) {
        // result.RoleId = json.RoleId;
        result.Nick = json.Nick;
        result.Mobile = json.Mobile;
        result.Status = json.Status;
        result.UpdateDate = json.UpdateDate;
        result.save((err, res) => {
          if (!err) {
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

//修改管理员密码
Admin.statics.setAdminPassword = function(json, oldpwd) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (result) {
        decryptJSON(oldpwd, result.Password).then(pass => {
          if (pass) {
            encryptJSON(json.Password).then(newpwd => {
              result.Password = newpwd;
              result.UpdateDate = json.UpdateDate;
              result.save((err, res) => {
                if (!err) {
                  resolve(res);
                } else {
                  reject({ Message: err });
                }
              })
            })
          } else {
            reject({ Message: "旧密码不正确", Code: 400 });
          }
        })
      } else {
        reject({ Message: error });
      }
    })
  })
}

let Admins = mongoose.model('Admins', Admin);
module.exports = Admins;
