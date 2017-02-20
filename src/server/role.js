/**
 * 管理角色
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Role = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("role")
  }, //角色id
  Name: {
    type: String,
    required: true,
  }, //名称
  ModuleIds: {
    type: Array,
    default: [],
  }, //管理模块Id集合
  Modules: {
    type: Array,
    default: [],
  }, //管理模块集合
  Remark: {
    type: String,
    default: ""
  }, //备注
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  }
})

//获取管理角色列表
Role.statics.getRoleList = function() {
  return new Promise((resolve, reject) => {
    let query = "";
    if (json.Name !== "") {
      //根据名称搜索
      query = this.find({ Name: json.Name });
    } else {
      query = this.find();
      query.skip(json.Index * json.Size); //跳过多少个数据
      query.limit(json.Size); //限制Size条数据
      query.sort({ UpdateDate: -1 }); //根据添加日期倒序      
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

//根据Id获取管理模块集合
Role.statics.getModulesById = function(RoleId) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: RoleId });
    query.select("Modules");
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

//新增管理角色
Role.statics.addRole = function(json) {
  return new Promise((resolve, reject) => {
    json.save((error, res) => {
      if (!error) {
        resolve(res); //新增的数据
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

//修改管理角色
Role.statics.setRole = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Name = json.Name;
          result.ModuleIds = json.ModuleIds;
          result.Modules = json.Modules;
          result.Remark = json.Remark;
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

//删除管理角色
Role.statics.delRole = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (!error) {
        result.remove((err, res) => {
          if (!err) {
            resolve(res); //删除后的数据
          } else {
            // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
            reject(error);
          }
        })
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject(error);
      }
    })
  })
}

let Roles = mongoose.model('Roles', Role);
module.exports = Roles;
