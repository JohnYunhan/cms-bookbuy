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
  },
  Status: {
    type: Number,
    default: true
  } //是否启用
})

//获取管理角色列表
Role.statics.getRoleList = function(index, size, json) {
  return new Promise((resolve, reject) => {
    let query = "";
    let total = 0;
    if (json.Name !== "") {
      //根据名称搜索
      let name = new RegExp(json.Name); //创建正则表达式
      query = this.find({ Name: { $regex: name } });
      total = this.find({ Name: { $regex: name } }).count();
    } else {
      query = this.find();
      total = this.count();
      query.skip(index * size); //跳过多少个数据
      query.limit(size); //限制Size条数据
      query.sort({ UpdateDate: -1 }); //根据添加日期倒序      
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

//根据Id获取管理模块集合
Role.statics.getModulesById = function(Id) {
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

//新增管理角色
Role.statics.addRole = function(json) {
  return new Promise((resolve, reject) => {
    json.Id = uniqid("role");
    json.save((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  })
}

//修改管理角色
Role.statics.editRole = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (result) {
        result.Name = json.Name;
        result.ModuleIds = json.ModuleIds;
        result.Modules = json.Modules;
        result.Remark = json.Remark;
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

//删除管理角色
Role.statics.delRole = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (result) {
        result.remove((err, res) => {
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

let Roles = mongoose.model('Roles', Role);
module.exports = Roles;
