/**
 * 管理模块
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Module = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    // default: uniqid("module")
  }, //模块id
  Name: {
    type: String,
    required: true
  }, //模块名称
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  }
})

//获取管理模块列表
Module.statics.getModuleList = function() {
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

//根据Id获取管理模块
Module.statics.getModuleById = function(ModuleId) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: ModuleId });
    query.select("Name");
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

//新增管理模块
Module.statics.addModule = function(json) {
  return new Promise((resolve, reject) => {
    json.Id = uniqid("module");
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

//修改管理模块
Module.statics.setModule = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Name = json.Name;
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

//删除模块
Module.statics.delModule = function(Id) {
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

let Modules = mongoose.model('Modules', Module);
module.exports = Modules;
