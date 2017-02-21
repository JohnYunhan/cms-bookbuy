/**
 * 图书
 */
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native promises

let Book = mongoose.Schema({
  Id: {
    type: String,
    unique: true,
    index: true,
    default: uniqid("book")
  },
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  Author: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    required: true,
  }, //图书类别
  Press: {
    type: String,
    required: true,
  }, //出版社
  PublishDate: {
    type: String,
    required: true,
  }, //出版社日期
  Edition: {
    type: Number,
    default: 1,
  }, //版次
  ISBN: {
    type: String,
    required: true,
  },
  WordsCount: {
    type: Number,
    required: true,
  }, //字数
  Abstract: {
    type: String,
    required: true,
  }, //简介
  Directory: {
    type: String,
    default: ""
  }, //目录  
  Image: {
    type: Array,
    required: true,
  },
  ListPrice: {
    type: Number,
    required: true,
  }, //定价
  SellPrice: {
    type: Number,
    required: true,
  }, //售价
  Count: {
    type: Number,
    required: true,
  }, //库存数量  
  ClickCount: {
    type: Number,
    default: 0
  }, //点击次数
  IsRecommend: {
    type: Number,
    default: 0
  }, //是否推荐,1:是,0:否 
  IsSoldOut: {
    type: Number,
    default: 0
  }, //是否售罄,1:是,0:否 
  CreateDate: {
    type: Number,
    default: Date.now()
  },
  UpdateDate: {
    type: Number,
    default: Date.now()
  },
});

//获取最新图书(新到图书)
Book.statics.getNewBook = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.find({ IsSoldOut: 0 });
    query.sort({ UpdateDate: -1 }); //根据添加时间倒叙
    query.skip(json.Index * json.Size); //跳过多少个数据
    query.limit(json.Size); //限制Size条数据
    query.exec((error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  })
}

//获取最热图书(畅销榜)
Book.statics.getHotBook = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.find({ ClickCount: { $gt: 0 } });
    query.skip(json.Index * json.Size); //跳过多少个数据
    query.limit(json.Size); //限制Size条数据
    query.exec((error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  })
}

//获取图书列表
Book.statics.getBookList = function(json) {
  return new Promise((resolve, reject) => {
    let query = "";
    if (json.Name !== "") {
      //根据图书名称搜索
      query = this.find({ Name: /json.Name/ })
    } else if (json.Author !== "") {
      //根据图书作者搜索
      query = this.find({ Author: /json.Author/ })
    } else if (json.Press !== "") {
      //根据出版社搜索
      query = this.find({ Press: /json.Press/ })
    } else if (json.Category !== "") {
      //根据分类搜索
      query = this.find({ Category: /json.Category/ })
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
        reject(error);
        // reject({ Message: "服务器错误，请稍后再试", Code: 400 });
      }
    })
  })
}

//根据Id获取图书
Book.statics.getBookById = function(Id) {
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

//增加图书
Book.statics.addBook = function(json) {
  return new Promise((resolve, reject) => {
    json.save((error, res) => {
      if (!error) {
        resolve(res);
      } else {
        reject({ Message: error.message, Code: 500 });
      }
    })
  })
}

//删除图书
Book.statics.delBook = function(Id) {
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

//修改图书
Book.statics.setBook = function(json) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: json.Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.Name = json.Name;
          result.Author = json.Author;
          result.Press = json.Press;
          result.Category = json.Category;
          result.PublishDate = json.PublishDate;
          result.Edition = json.Edition;
          result.ISBN = json.ISBN;
          result.WordsCount = json.WordsCount;
          result.Abstract = json.Abstract;
          // result.Directory = json.Directory;
          result.Image = json.Image;
          result.ListPrice = json.ListPrice;
          result.SellPrice = json.SellPrice;
          result.Count = json.Count;
          result.IsRecommend = json.IsRecommend;
          result.IsSoldOut = json.IsSoldOut;
          result.UpdateDate = json.UpdateDate;
          result.save((error, res) => {
            resolve(res);
          })
        } else {
          reject(error);
        }
      } else {
        reject(error);
      }
    })
  })
}

//增加图书的点击次数
Book.statics.addClickCount = function(Id) {
  return new Promise((resolve, reject) => {
    let query = this.findOne({ Id: Id });
    query.exec((error, result) => {
      if (!error) {
        if (result) {
          result.ClickCount++;
          result.save((error, res) => {
            resolve(res);
          })
        } else {
          reject(error);
        }
      } else {
        reject(error);
      }
    })
  })
}

let Books = mongoose.model('Books', Book);
module.exports = Books;
