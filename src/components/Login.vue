<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm.account" auto-complete="off" @keyup.enter.native.prevent="login" placeholder="账号" autofocus></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" auto-complete="off" @keyup.enter.native.prevent="login" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked style="margin:0px 0px 35px 0px;">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login">登 录</el-button>
      <!--<el-button @click.native.prevent="reset">取消</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
      return {
        ruleForm: {
          account: '',
          password: ''
        },
        rules: {
          account: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            //{ validator: validaePass }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        UsrName: "",
      };
    },
    methods: {
      reset() {
        this.$refs.ruleForm.resetFields();
      },
      login() {
        var _this = this;
        var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        var data = {
          Password: this.ruleForm.password,
          Checked: this.checked
        };
        if (mobile.test(this.ruleForm.account)) {
          //手机号登陆
          data.Nick = "";
          data.Mobile = this.ruleForm.account;
        } else {
          //昵称登陆
          data.Nick = this.ruleForm.account;
          data.Mobile = "";
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            data = JSON.stringify(data);
            fetch("/api/login", {
              method: "POST",
              credentials: "include",
              headers: {
                'Content-Type': "application/json"
              },
              body: data
            }).then(res => res.json()).then(result => {
              if (result.Code === 200) {
                this.UsrName = result.Nick;
                _this.$router.replace('/welcome');
              } else {
                console.log(result)
                _this.$message.error(result.Message);
              }
            }).catch(error => {
              console.log(error)
              console.log(33)
            })
          }
        });
      },
    }
}
</script>
<style scoped>
.card-box {
  padding: 20px;
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #F9FAFC;
  margin: 120px auto;
  width: 400px;
  border: 2px solid #8492A6;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.loginform {
  width: 350px;
  padding: 35px 35px 15px 35px;
}
</style>
