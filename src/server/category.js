/**
 * 图书类别
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Category = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("category")
  }, //类别id
  Name: {
    type: String,
    required: true
  }, //类别名称
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  }
})

//获取类别列表
Category.statics.getCategoryList = function() {
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
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//根据Id获取类别
Category.statics.getCategoryById = function(categoryId) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: categoryId });
    query.select("Name");
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

//新增类别
Category.statics.addCategory = function(json) {
  return new Promise((resolve, reject) => {
    json.save((error, res) => {
      if (!error) {
        resolve(res); //新增的数据
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//修改类别
Category.statics.setCategory = function(json) {
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

//删除类别
Category.statics.delCategory = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (!error) {
        result.remove((err, res) => {
          if (!err) {
            resolve(res); //删除后的数据
          } else {
            reject(error);
            // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          }
        })
      } else {
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}


let Categorys = mongoose.model('Categorys', Category);
module.exports = Categorys;
