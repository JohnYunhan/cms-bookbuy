let express = require('express');
let router = express.Router();
let Admins = require("./admin");
let Books = require("./book");
let Users = require("./user");
let Roles = require("./role");
let Modules = require("./module");
let Orders = require("./order");
let Presses = require("./press");
let Categorys = require("./category");
let Pictures = require("./picture");
let jwt = require('jsonwebtoken');
const jwtSecret = "zcvaetmbnhgpwegdfvcmghsdpdj"; //jwt密钥

// 生成一个cookie
function setCookie(json) {
  return jwt.sign(json, jwtSecret, { expiresIn: 60 * 60 * 24 * 7 }); //七天过期
}

//首页
router.post('/index', function(req, res, next) {
  // 获取管理模块
  let RoleId = req.body.RoleId;
  Roles.getAdminModule(RoleId).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
})

//管理员登录
router.post('/login', function(req, res, next) {
  let json = new Admins({
    Nick: req.body.Nick,
    Mobile: req.body.Mobile,
    Password: req.body.Password
  });
  Admins.adminLogin(json).then(result => {
    //记住密码
    if (req.body.Checked) {
      res.cookie("token", setCookie({
        Id: result.Id,
        RoleId: result.RoleId,
        Nick: result.Nick,
        LoginDate: Date.now()
      }));
    }
    res.send({ Data: result, Message: "登录成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取管理模块
// router.post('/getAdminModule', function(req, res, next) {

// });

//根据Id获取管理员信息
router.post('/getAdminById', function(req, res, next) {
  let Id = req.body.Id;
  Admins.getAdminById(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增管理员
router.post('/addAdmin', function(req, res, next) {
  let json = new Admins({
    RoleId: parseInt(req.body.RoleId),
    Nick: req.body.Nick,
    Password: req.body.Password,
    Mobile: req.body.Mobile
  });
  Admins.addAdmin(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改管理员
router.post('/setAdmin', function(req, res, next) {
  let json = new Admins({
    Id: req.body.Id,
    RoleId: req.body.RoleId,
    Nick: req.body.Nick,
    Mobile: req.body.Mobile,
    UpdateDate: Date.now()
  });
  Admins.setAdmin(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改管理员密码
router.post('/setAdminPassword', function(req, res, next) {
  let json = new Admins({
    Id: req.AdminInfo.Id,
    Password: req.body.NewPassword,
    UpdateDate: Date.now()
  });
  let oldpwd = req.body.OldPassword;
  Admins.setAdminPassword(json, oldpwd).then(result => {
    res.send({ Data: result, Message: "修改成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//加入或解除黑名单(管理员)
router.post('/setAdminValid', function(req, res, next) {
  let json = new Admins({
    Id: req.AdminInfo.Id,
    Valid: req.body.Valid,
    UpdateDate: Date.now()
  });
  Admins.setAdminValid(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取会员列表
router.post('/getUserList', function(req, res, next) {
  let json = new Users({
    Nick: req.body.Nick,
    Mobile: req.body.Mobile
  });
  let index = req.body.Index;
  let size = req.body.Size;
  Users.getUserList(json, index, size).then(result => {
    res.send({ Data: result.Data, TotalCount: result.TotalCount, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//根据Id获取会员
router.get('/getUserById', function(req, res, next) {
  let Id = req.query.Id;
  console.log(Id)
  Users.getUserById(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//加入或解除黑名单(会员)
router.post('/setUserValid', function(req, res, next) {
  let json = new Users({
    Id: req.body.Id,
    Valid: req.body.Valid,
    UpdateDate: Date.now()
  });
  Users.setUserValid(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取图书列表
router.post('/getBookList', function(req, res, next) {
  let json = new Books({
    Name: req.body.Name,
    Author: req.body.Author,
    Press: req.body.Press,
    Category: req.body.Category
  });
  Books.getBookList(req.body.Index, req.body.Size, json).then(result => {
    res.send({ Data: result.Data, TotalCount: result.TotalCount, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//根据Id获取图书
router.get('/getBookById', function(req, res, next) {
  let Id = req.query.Id;
  console.log(Id)
  Books.getBookById(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增图书
router.post('/addBook', function(req, res, next) {
  let json = new Books({
    Name: req.body.Name,
    Author: req.body.Author,
    Category: req.body.Category,
    Press: req.body.Press,
    PublishDate: req.body.PublishDate,
    Edition: parseInt(req.body.Edition),
    ISBN: req.body.ISBN,
    WordsCount: parseInt(req.body.WordsCount),
    Abstract: req.body.Abstract,
    Image: req.body.Image,
    ListPrice: parseFloat(req.body.ListPrice),
    SellPrice: parseFloat(req.body.SellPrice),
    Count: parseInt(req.body.Count),
    IsRecommend: parseInt(req.body.IsRecommend)
  });
  Books.addBook(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改图书
router.post('/setBook', function(req, res, next) {
  let json = new Books({
    Id: req.body.Id,
    Name: req.body.Name,
    Author: req.body.Author,
    Category: req.body.Category,
    Press: req.body.Press,
    PublishDate: req.body.PublishDate,
    Edition: parseInt(req.body.Edition),
    ISBN: req.body.ISBN,
    WordsCount: parseInt(req.body.WordsCount),
    Abstract: req.body.Abstract,
    Image: req.body.Image,
    ListPrice: parseFloat(req.body.ListPrice),
    SellPrice: parseFloat(req.body.SellPrice),
    Count: parseInt(req.body.Count),
    ClickCount: parseInt(req.body.ClickCount),
    IsRecommend: parseInt(req.body.IsRecommend),
    IsSoldOut: parseInt(req.body.IsSoldOut),
    UpdateDate: Date.now()
  });
  Books.setBook(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error, Code: 400 });
  })
});

//删除图书
router.post('/delBook', function(req, res, next) {
  let Id = req.body.Id;
  Books.delBook(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error, Code: 400 });
  })
});

//获取订单列表
router.post('/getOrderList', function(req, res, next) {
  let json = new Orders({
    Id: req.body.OrderId,
    UserId: req.body.UserId,
    Status: req.body.Status
  });
  Orders.getOrderList(req.body.Index, req.body.Size, json).then(result => {
    res.send({ Data: result.Data, TotalCount: result.TotalCount, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error, Code: 400 });
  })
});

//修改订单状态
router.post('/setOrderStatus', function(req, res, next) {
  let json = new Orders({
    Id: req.body.Id,
    Status: req.body.Status,
    UpdateDate: Date.now()
  });
  Orders.setOrderStatus(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error, Code: 400 });
  })
});
//新增订单（下单）
router.post('/addOrder', function(req, res, next) {
  let json = new Orders({
    Id: req.body.Id,
    Nick: req.body.Nick,
    BookId: req.body.BookId,
    BookName: req.body.BookName,
    UserId: req.body.UserId,
    Count: parseInt(req.body.Count),
    Freight: parseFloat(req.body.Freight),
    Total: parseFloat(req.body.Total),
    Name: req.body.Name,
    Mobile: req.body.Mobile,
    Address: req.body.Address
  });
  Orders.addOrder(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error, Code: 400 });
  })
});
//获取出版社列表
router.post('/getPressList', function(req, res, next) {
  let json = new Presses({
    Name: req.body.Name
  });
  let size = req.body.Size;
  let index = req.body.Index;
  Presses.getPressList(index, size, json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增出版社
router.post('/addPress', function(req, res, next) {
  let json = new Presses({
    Name: req.body.Name
  });
  console.log(json)
  Presses.addPress(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//删除出版社
router.post('/delPress', function(req, res, next) {
  let Id = req.body.Id;
  Presses.delPress(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改出版社
router.post('/setPress', function(req, res, next) {
  let json = new Presses({
    Id: req.body.Id,
    Name: req.body.Name,
    UpdateDate: Date.now()
  });
  Presses.setPress(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取轮播图列表
router.post('/getPictureList', function(req, res, next) {
  let json = new Pictures({
    Name: req.body.Name
  });
  let size = req.body.Size;
  let index = req.body.Index;
  Pictures.getPictureList(index, size, json).then(result => {
    res.send({ Data: result.Data, TotalCount: result.TotalCount, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增轮播图
router.post('/addPicture', function(req, res, next) {
  let json = new Pictures({
    Name: req.body.Name,
    Url: req.body.Url,
    Status: parseInt(req.body.Status)
  });
  Pictures.addPicture(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//删除轮播图
router.post('/delPicture', function(req, res, next) {
  let Id = req.body.Id;
  Pictures.delPicture(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改轮播图
router.post('/setPicture', function(req, res, next) {
  let json = new Pictures({
    Id: req.body.Id,
    Name: req.body.Name,
    Url: req.body.Url,
    Status: parseInt(req.body.Status),
    UpdateDate: Date.now()
  });
  Pictures.setPicture(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取类别列表
router.post('/getCategoryList', function(req, res, next) {
  let json = new Categorys({
    Index: req.body.Index,
    Size: req.body.Size,
    Name: req.body.Name
  });
  Categorys.getCategoryList(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增类别
router.post('/addCategory', function(req, res, next) {
  let json = new Categorys({
    Name: req.body.Name
  });
  Categorys.addCategory(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//删除类别
router.post('/delCategory', function(req, res, next) {
  let Id = req.body.Id;
  Categorys.delCategory(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改类别
router.post('/setCategory', function(req, res, next) {
  let json = new Categorys({
    Id: req.body.Id,
    Name: req.body.Name,
    UpdateDate: Date.now()
  });
  Categorys.setCategory(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取管理角色列表
router.post('/getRoleList', function(req, res, next) {
  let json = new Roles({
    Index: req.body.Index,
    Size: req.body.Size,
    Name: req.body.Name
  });
  Roles.getRoleList(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增管理角色
router.post('/addRole', function(req, res, next) {
  let json = new Roles({
    Name: req.body.Name,
    ModuleIds: req.body.ModuleIds,
    Modules: req.body.Modules,
    Remark: req.body.Remark
  });
  Roles.addRole(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//删除管理角色
router.post('/delRole', function(req, res, next) {
  let Id = req.body.Id;
  Roles.delRole(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改管理角色
router.post('/setRole', function(req, res, next) {
  let json = new Roles({
    Id: req.body.Id,
    Name: req.body.Name,
    ModuleIds: req.body.ModuleIds,
    Modules: req.body.Modules,
    Remark: req.body.Remark,
    UpdateDate: Date.now()
  });
  Roles.setRole(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//获取模块列表
router.post('/getModuleList', function(req, res, next) {
  let json = new Modules({
    Index: req.body.Index,
    Size: req.body.Size,
    Name: req.body.Name
  });
  Modules.getModuleList(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//新增模块
router.post('/addModule', function(req, res, next) {
  let json = new Modules({
    Name: req.body.Name
  });
  Modules.addModule(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//删除模块
router.post('/delModule', function(req, res, next) {
  let Id = req.body.Id;
  Modules.delModule(Id).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

//修改模块
router.post('/setModule', function(req, res, next) {
  let json = new Modules({
    Id: req.body.Id,
    Name: req.body.Name,
    UpdateDate: Date.now()
  });
  Modules.setModule(json).then(result => {
    res.send({ Data: result, Message: "执行成功", Code: 200 });
  }).catch(error => {
    res.send({ Message: error.Message, Code: error.Code });
  })
});

module.exports = router;
