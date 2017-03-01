<template>
  <section>
    <header v-show="!openForm">
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addAdmin="addAdmin" @searchAdmin="searchAdmin" @getAdmin="getAdmin"></search>
    </header>
    <section v-if="!openForm" style="padding:0 20px 18px">
      <el-table :data="tableData" border style="width:100%">
        <!-- <el-table-column align="center" prop="RoleName" label="角色名称">
        </el-table-column> -->
        <el-table-column align="center" prop="Nick" label="昵称">
        </el-table-column>
        <el-table-column align="center" prop="Mobile" label="手机">
        </el-table-column>
        <el-table-column align="center" prop="CreateDate" label="注册日期">
        </el-table-column>
        <el-table-column align="center" prop="UpdateDate" label="更新日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template scope="scope">
            <span style="color:#13ce66" v-if="scope.row.Valid">已启用</span>
            <span style="color:red" v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="fa fa-edit fa-lg" @click="editAdmin(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column>
      </el-table>
      <section style="padding:0;margin-top:18px;margin-left:-16px">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </section>
    </section>
    <section v-else>
      <h5 style="text-align: center;margin: 10px 0"><b>{{title}}</b></h5>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" style="">
            <!-- <el-form-item label="角色" prop="RoleId">
              <el-select v-model="ruleForm.RoleId">
                <el-option v-for="item in RoleItem" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="昵称" prop="Nick">
              <el-input @keyup.enter="Submit" v-model="ruleForm.Nick" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item v-if="isAdd" label="密码" prop="Password">
              <el-input @keyup.enter="Submit" style="width: 250px;" v-model="ruleForm.Password"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="Mobile">
              <el-input @keyup.enter="Submit" style="width: 250px;" v-model="ruleForm.Mobile"></el-input>
            </el-form-item>
            <el-form-item label="启用" prop="Valid">
              <el-switch on-text="是" v-bind:true-value="true" v-bind:false-value="false" off-text="否" v-model="ruleForm.Valid"></el-switch>
            </el-form-item>
            <el-form-item style="text-align: center;margin-right: 80px">
              <el-button type="primary" @click="Submit">提 交</el-button>
              <el-button @click="Close">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </section>
  </section>
</template>
<script>
import search from "../common/search.vue";
export default {
  props: [],
  data() {
    return {
      list: [{
        label: " 昵 称",
        value: "Nick"
      }, {
        label: " 手 机",
        value: "Mobile"
      }], //搜索类型
      have: true,
      source: "admin", //搜索种类
      searchType: "Nick", //默认的搜索类型
      tableData: [],
      // loading: true,
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
      openForm: false, //打开添加或编辑图书的表单
      addItem: {},
      ruleForm: {
        // RoleId: "",
        // RoleName: "",
        Nick: "",
        Password: "",
        Mobile: "",
        Valid: true
      },
      rules: {
        Nick: [{
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }],
        Password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        Mobile: [{
          required: true,
          message: '请输入手机',
          trigger: 'blur'
        }]
      },
      RoleItem: [],
      title: "新增管理员",
      isAdd: true, //判断是否为新增
    }
  },
  created() {
    this.getAdmin(0, 10, "", "");
    this.addItem = this.ruleForm; //保存ruleForm的初始值
  },
  methods: {
    getAdmin(index, size, nick, mobile) {
      var _this = this;
      var data = {
        Index: index,
        Size: size,
        Nick: nick,
        Mobile: mobile
      };
      data = JSON.stringify(data);
      fetch("/api/getAdminList", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          _this.tableData = result.Data;
          _this.pageSize = _this.tableData.length;
          _this.totalCount = result.TotalCount;
          _this.shiftDate(_this.tableData);
        } else {
          console.log(result)
          _this.tableData = [];
          if (result.Message !== null) {
            _this.$message.error('服务器错误，请稍后再试');
          }
        }
      }).catch(error => {
        _this.tableData = [];
        _this.$message.error('服务器错误，请稍后再试');
        console.log(error)
      })
    },
    getRole() {

    },
    addAdmin() {
      this.openForm = true;
      this.isAdd = true;
      this.title = "新增管理员";
    },
    searchAdmin(type, key) {
      // this.loading = true;
      if (type === "Nick") {
        this.getAdmin(0, 10, key, "");
      } else if (type === "Mobile") {
        this.getAdmin(0, 10, "", key);
      } else {
        this.getAdmin(0, 10, "", "");
      }
    },
    editAdmin(row) {
      this.openForm = true;
      this.isAdd = false;
      this.title = "编辑管理员";
      this.ruleForm = row;
    },
    Submit() {
      if (this.isAdd) {
        this.submitAdd();
      } else {
        this.submitEdit();
      }
    },
    //提交新增的管理员
    submitAdd() {
      var _this = this;
      //根据RoleId遍历出对应的RoleName
      for (var item of this.RoleItem) {
        if (item.Id == this.ruleForm.RoleId) {
          this.ruleForm.RoleName = item.Name;
        }
      }
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/addAdmin", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          _this.$message({
            message: '新增成功',
            type: 'success',
            duration: 3000
          });
          _this.Close();
        } else {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(result)
        }
      }).catch(error => {
        _this.$message.error('服务器错误，请稍后再试');
        console.log(error)
      })
    },
    //提交编辑的管理员
    submitEdit() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/editAdmin", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          _this.$message({
            message: '编辑成功',
            type: 'success',
            duration: 3000
          });
          _this.Close();
        } else {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(result)
        }
      }).catch(error => {
        _this.$message.error('服务器错误，请稍后再试');
        console.log(error)
      })
    },
    Close() {
      this.openForm = false;
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = this.addItem; //将ruleForm初始化
      this.getAdmin(0, 10, "", "");
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getAdmin(this.currentPage - 1, val, "", "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getAdmin(val - 1, this.pageSize, "", "");
    },
    //日期转换
    shiftDate(data) {
      for (var i = 0; i < data.length; i++) {
        var update_date = new Date(data[i].UpdateDate);
        this.tableData[i].UpdateDate = update_date.toLocaleDateString();
        var create_date = new Date(data[i].CreateDate);
        this.tableData[i].CreateDate = create_date.toLocaleDateString();
      }
    },
  },
  watch: {
    totalCount: function(val) {
      this.totalCount = val;
    },
  },
  components: {
    search,
  }
}
</script>
<style scoped>
footer {
  margin-left: 5px;
  margin-bottom: 10px;
}
</style>
