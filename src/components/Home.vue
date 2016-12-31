<template>
	<el-row class="panel">
		<el-col :span="24" class="panel-top">
			<el-col :span="12" style="font-size:26px;">
				<img src="../assets/book.png" class="logo" alt="logo"> <span><i style="color:#20a0ff">BookBuy</i>图书商城管理系统</span>
			</el-col>
			<el-col :span="8">
				<h5 class="admin">
					<i class="fa fa-user" aria-hidden="true" style="margin-right:5px;"></i>欢迎您~
					<el-dropdown>
						<span class="el-dropdown-link">{{ adminName }}</span>
						<el-dropdown-menu slot="dropdown">
					    <el-dropdown-item v-on:click="updatePwd">修改密码</el-dropdown-item>
					    <el-dropdown-item v-on:click="logout">注销登录</el-dropdown-item>
				  	</el-dropdown-menu>
					</el-dropdown>
				</h5>
			</el-col>
			<el-col :span="4">
				<el-tooltip class="item tip-logout" effect="dark" content="退出" placement="bottom" style="padding:0px;">
					<!--<i class="logout" v-on:click="logout"></i>-->
					<i class="fa fa-sign-out" aria-hidden="true" v-on:click="logout"></i>
				</el-tooltip>
			</el-col>
		</el-col>
		<el-col :span="24" class="panel-center">
			<!--<el-col :span="4">-->
			<aside style="width:230px;">
				
				<el-menu style="border-top: 1px solid #475669;" class="el-menu-vertical-demo" @open="handleopen"
					@close="handleclose" @select="handleselect" theme="dark" unique-opened router>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-message"></i>会员</template>
						<el-menu-item index="/member">会员管理</el-menu-item>
						<el-menu-item index="/order">订单管理</el-menu-item>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><i class="fa fa-id-card-o"></i>图书</template>
						<el-menu-item index="/book">图书管理</el-menu-item>
						<el-menu-item index="/category">类别管理</el-menu-item>
						<el-menu-item index="/publish">出版社管理</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="fa fa-id-card-o"></i>仓库</template>
						<el-menu-item index="/inStorage">入库管理</el-menu-item>
						<el-menu-item index="/outStorage">出库管理</el-menu-item>
						<el-menu-item index="/inventory">库存管理</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="fa fa-id-card-o"></i>系统</template>
						<el-menu-item index="/administrator">管理员管理</el-menu-item>
						<el-menu-item index="/role">角色管理</el-menu-item>
						<el-menu-item index="/module">模块管理</el-menu-item>
					</el-submenu>
				</el-menu>
				<!-- <el-menu style="border-top: 1px solid #475669;" default-active="/table" class="el-menu-vertical-demo" @open="handleopen"
					@close="handleclose" @select="handleselect" theme="dark" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu> -->
			</aside>
			<!--</el-col>-->
			<!--<el-col :span="20" class="panel-c-c">-->
			<section class="panel-c-c">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" style="margin-bottom:15px;">
						<strong style="width:200px;float:left;color: #475669;">{{currentPathName}}</strong>
						<el-breadcrumb separator="/" style="float:right;">
							<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathNameParent!=''">{{currentPathNameParent}}</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" style="background-color:#fff;box-sizing: border-box;">
						<transition name="fade">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
			<!--</el-col>-->
		</el-col>
	</el-row>
	<el-dialog title="修改密码" v-model="updatePwdFormVisible" :close-on-click-modal="false">
		<el-form :model="updatePwdForm" :rules="rulePwdForm" ref="updatePwdForm" >
			<el-form-item label="原密码" label-width="80px" prop="originalPwd">
    		<el-input type="password" v-model="updatePwdForm.originalPwd" auto-complete="off"></el-input>
  		</el-form-item>
  		<el-form-item label="新密码" label-width="80px" prop="newPwd">
				<el-input type="password" v-model="updatePwdForm.newPwd" auto-complete="off"></el-input>
  		</el-form-item>
  		<el-form-item label="确认新密码" label-width="120px" prop="checkPwd">
    		<el-input type="password" v-model="updatePwdForm.checkPwd" auto-complete="off"></el-input>
  		</el-form-item>
  		<el-form-item>
		    <el-button type="primary" @click="updatePwdSubmit">提交</el-button>
		    <el-button @click="updatePwdReset">重置</el-button>
  		</el-form-item>
		</el-form>
  </el-dialog>
</template>

<script>
	export default {
    data () {
			var validateOriginalPwd = (rule, value, callback) => {
        if (value === '') {
					callback(new Error('请输入原密码'))
				} else {
					callback();
        }
      }
			var validateNewPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.rulePwdForm.checkPwd !== '') {
            this.$refs.rulePwdForm.validateField('checkPwd')
          }
          callback()
        }
      }
      var validateCheckPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认新密码'))
        } else if (value !== this.rulePwdForm.newPwd) {
          callback(new Error('确认新密码与新密码不一致!'))
        } else {
          callback()
        }
      }
      return {
				currentPathName:'',
				currentPathNameParent:'',
				updatePwdFormVisible: false,//修改密码界面是否显示
				updatePwdForm: {
          originalPwd: '',
          newPwd: '',
          checkPwd: ''
        },
        rulePwdForm: {
				originalPwd: [
            { validator: validateOriginalPwd, trigger: 'blur' }
          ],
          newPwd: [
            { validator: validateNewPwd, trigger: 'blur' }
          ],
          checkPwd: [
            { validator: validateCheckPwd, trigger: 'blur' }
          ]
        }
      };
		},
		methods: {
			updatePwdSubmit() {
				this.$refs.rulePwdForm.validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
			},
			updatePwdReset() {
				this.$refs.rulePwdForm.resetFields()
			},
			//退出登录
			logout() {
				var _this=this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.$router.replace('/login')
				}).catch(() => {
							
				});
			},
		},
		watch: {
			'$route' (to, from) {//监听路由改变
				this.currentPathName=to.name;
				this.currentPathNameParent=to.matched[0].name;
			}
    }
	}
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}
	
	.panel {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
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
		left: 230px;
		overflow-y: scroll;
		padding: 20px;
	}
	
	.logout {
		background: url(../assets/logo.png);
		background-size: contain;
		width: 20px;
		height: 20px;
		float: left;
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
		text-align: center;
	}
</style>