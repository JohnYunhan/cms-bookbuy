<template>
  <section>
    <el-row class="panel">
      <!-- 页面顶部 -->
      <el-col :span="24" class="panel-top">
        <el-col :span="12" style="font-size:24px;">
          <img src="../assets/book.png" class="logo" alt="logo"> <span><i style="color:#20a0ff">BookBuy</i>&nbsp;图书网后台管理系统</span>
        </el-col>
        <el-col :span="11">
          <h5 class="admin">
            <i class="fa fa-user" aria-hidden="true" style="margin-right:5px;"></i>欢迎您&nbsp;~&nbsp;
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">{{ adminName }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </h5>
        </el-col>
        <el-col :span="1">
          <el-tooltip class="item tip-logout" effect="dark" content="退出" placement="bottom" style="padding:0px;">
            <i class="fa fa-sign-out" aria-hidden="true" v-on:click="logout"></i>
          </el-tooltip>
        </el-col>
      </el-col>
      <el-col :span="24" class="panel-center">
        <!-- 菜单 -->
        <aside>
          <el-menu default-active="/welcome" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" theme="dark" unique-opened router>
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
              <el-submenu :index="index+''">
                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                <el-menu-item v-for="child in item.children" :index="child.path">{{child.name}}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </aside>
        <!-- 内容 -->
        <section class="panel-c-c">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" style="margin-bottom:5px;">
              <el-breadcrumb separator=">" style="float:left;">
                <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentPathNameParent!='首页'">{{currentPathNameParent}}</el-breadcrumb-item>
                <el-breadcrumb-item v-show="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
              </el-breadcrumb>
              <strong style="float:right;color: #475669;">{{currentPathName}}</strong>
            </el-col>
            <el-col :span="24" style="background-color:#fff;box-sizing: border-box;">
              <transition>
                <router-view></router-view>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
    <!-- 修改密码对话框 -->
    <el-dialog class="updatePwdForm" size="tiny" top="25%" title="修改密码" v-model="updatePwdFormVisible" :close-on-click-modal="false">
      <el-form :model="updatePwdForm" :rules="rulePwdForm" ref="updatePwdForm">
        <el-form-item label="原密码" label-width="82px" prop="originalPwd">
          <el-input type="password" v-model="updatePwdForm.originalPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="82px" prop="newPwd">
          <el-input type="password" v-model="updatePwdForm.newPwd" placeholder="长度在6到12个字符"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" label-width="82px" prop="checkPwd">
          <el-input type="password" v-model="updatePwdForm.checkPwd"></el-input>
        </el-form-item>
        <el-form-item class="btnCenter">
          <el-button type="primary" @click="updatePwdSubmit('updatePwdForm')">提交</el-button>
          <el-button @click="updatePwdClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
      var validateOriginalPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        } else {
          callback();
        }
      }
      var validateNewPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (value.length < 6 || value.length > 12) {
          callback(new Error('长度在 6 到 12 个字符'));
        } else {
          if (this.updatePwdForm.checkPwd !== '') {
            this.$refs.updatePwdForm.validateField('checkPwd')
          }
          callback()
        }
      }
      var validateCheckPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认新密码'))
        } else if (value !== this.updatePwdForm.newPwd) {
          callback(new Error('确认新密码与新密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        adminName: "admin", //管理员名称
        currentPathName: "欢迎页",
        currentPathNameParent: "首页",
        updatePwdFormVisible: false, //修改密码界面是否显示
        updatePwdForm: {
          originalPwd: "", //原密码
          newPwd: "", //新密码
          checkPwd: "" //确认新密码
        },
        rulePwdForm: {
          originalPwd: [{
            validator: validateOriginalPwd,
            trigger: 'blur'
          }],
          newPwd: [{
            validator: validateNewPwd,
            trigger: 'blur'
          }],
          checkPwd: [{
            validator: validateCheckPwd,
            trigger: 'blur'
          }]
        },
        tableData: [],
      };
    },
    created() {

    },
    methods: {
      handleopen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleclose() {
        // console.log('handleclose');
      },
      handleselect(path) {

      },
      handleCommand(command) {
        if (command === "updatePwd") {
          this.updatePwd();
        } else {
          this.logout();
        }
      },
      updatePwd() {
        this.updatePwdFormVisible = true;
      },
      updatePwdSubmit(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              OldPassword: _this.updatePwdForm.originalPwd,
              NewPassword: _this.updatePwdForm.newPwd,
            };
            data = JSON.stringify(data);
            fetch("/api/setAdminPassword", {
              method: "POST",
              credentials: "include",
              headers: {
                'Content-Type': "application/json"
              },
              body: data
            }).then(res => res.json()).then(result => {
              if (result.Code === 200) {
                _this.updatePwdClose();
                _this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              } else {
                console.log(result)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updatePwdClose() {
        this.updatePwdForm.originalPwd = "";
        this.updatePwdForm.newPwd = "";
        this.updatePwdForm.checkPwd = "";
        this.updatePwdFormVisible = false;
      },
      //退出登录
      logout() {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.$router.replace('/login');
        }).catch(() => {

        });
      },
    },
    watch: {
      '$route' (to, from) { //监听路由改变
        this.currentPathName = to.name;
        this.currentPathNameParent = to.matched[0].name;
      }
    }
}
</script>
<style scoped>
.fadeOut-enter-active {
  animation: fadeOut 1.5s;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.panel {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  font-size: 16px;
}

.panel aside {
  width: 160px;
}

.panel-top {
  height: 60px;
  line-height: 60px;
  background: #1F2D3D;
  color: #c0ccda;
}

.panel-center {
  background: #324057;
  position: absolute;
  top: 60px;
  bottom: 0px;
  overflow: hidden;
}

.panel-c-c {
  background: #f1f2f7;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  left: 160px;
  overflow-y: scroll;
  padding: 20px;
}

.logo {
  width: 40px;
  float: left;
  margin: 10px 10px 10px 18px;
}

.tip-logout {
  float: right;
  margin-right: 20px;
  padding-top: 5px;
  cursor: pointer;
}

.admin {
  color: #c0ccda;
  text-align: right;
}

.el-dropdown-link {
  font-size: 18px;
  color: rgb(32, 160, 255);
  cursor: pointer;
}

.el-dropdown-link:hover {
  color: rgb(20, 120, 220);
  text-decoration: underline;
}


/*.updatePwdForm {
  width: 900px;
}*/


/*.btnCenter {
  text-align: right;
}*/
</style>
