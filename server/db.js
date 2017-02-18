/**
 * 数据表
 */
const { createID, encryptJSON, decryptJSON } = require("../utils/utils");
let uniqid = require('uniqid'); //生成唯一id
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; // Use native promises

const Admin = new Schema({
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
})
