/**
 * 轮播图
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Picture = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    // default: uniqid("picture")
  }, //轮播图id
  Name: {
    type: String,
    required: true
  }, //轮播图名称
  Url: {
    type: String,
    required: true
  }, //轮播图链接
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
  } //是否启用,1为启用，0为禁用
})

//获取轮播图列表
Picture.statics.getPictureList = function(index, size, json) {
  return new Promise((resolve, reject) => {
    let query = "";
    let total = 0;
    if (json.Name !== "") {
      //根据名称搜索
      let name = new RegExp(json.Name);
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
      total.exec((error, res) => {
        if (!error) {
          resolve({
            Data: result,
            TotalCount: res
          });
        } else {
          // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
          reject(error);
        }
      })
    })
  })
}

//根据Id获取轮播图
Picture.statics.getPictureById = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
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

//新增轮播图
Picture.statics.addPicture = function(json) {
  return new Promise((resolve, reject) => {
    json.Id = uniqid("picture");
    json.save((error, res) => {
      if (!error) {
        resolve(res); //新增的数据
      } else {
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
        reject({ Message: error.message, Code: 500 });
      }
    })
  })
}

//修改轮播图
Picture.statics.setPicture = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Name = json.Name;
          result.Url = json.Url;
          result.Status = json.Status;
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

//删除轮播图
Picture.statics.delPicture = function(Id) {
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

let Pictures = mongoose.model('Pictures', Picture);
module.exports = Pictures;
