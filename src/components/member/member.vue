<template>
  <section>
    <header v-show="!openForm">
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addMember="addMember" @searchMember="searchMember" @getMember="getMember"></search>
    </header>
    <section v-if="!openForm" style="padding:0 20px 18px">
      <el-table :data="tableData" border style="width:100%">
        <el-table-column align="center" prop="Nick" label="昵称">
        </el-table-column>
        <el-table-column align="center" prop="Name" label="姓名">
        </el-table-column>
        <el-table-column align="center" min-width="120" prop="Mobile" label="手机">
        </el-table-column>
        <el-table-column align="center" min-width="180" prop="Email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="Level" label="等级">
          <template scope="scope">
            <span v-if="scope.row.Level==1">注册会员</span>
            <span v-else-if="scope.row.Level==2">铜牌会员</span>
            <span v-else-if="scope.row.Level==3">银牌会员</span>
            <span v-else-if="scope.row.Level==4">金牌会员</span>
            <span v-else>钻石会员</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100" prop="CreateDate" label="注册日期">
        </el-table-column>
        <el-table-column align="center" min-width="100" prop="UpdateDate" label="更新日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template scope="scope">
            <span style="color:#13ce66" v-if="scope.row.Valid">已启用</span>
            <span style="color:red" v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="el-icon-edit" @click="editMember(scope.row)" style="cursor:pointer;font-size:18px"></i>
            <i class="el-icon-delete2" @click="delMember(scope.row)" style="cursor:pointer;font-size:18px"></i>
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
            <el-form-item label="昵称" prop="Nick">
              <el-input v-model="ruleForm.Nick" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item v-if="isAdd" label="密码" prop="Password">
              <el-input style="width: 250px;" v-model="ruleForm.Password"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="Mobile">
              <el-input style="width: 250px;" v-model="ruleForm.Mobile"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="Name">
              <el-input style="width: 250px;" v-model="ruleForm.Name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="Email">
              <el-input style="width: 250px;" v-model="ruleForm.Email"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="Address">
              <el-input style="width: 250px;" type="textarea" autosize v-model="ruleForm.Address"></el-input>
            </el-form-item>
            <el-form-item label="等级" prop="Level">
              <el-select v-model="ruleForm.Level">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
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
      source: "member", //搜索种类
      searchType: "Nick", //默认的搜索类型
      tableData: [],
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
      openForm: false, //打开添加或编辑图书的表单
      ruleForm: {
        Nick: "",
        Password: "",
        Name: "",
        Mobile: "",
        Email: "",
        Address: "",
        Level: 1,
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
      options: [{
        label: "注册会员",
        value: 1,
      }, {
        label: "铜牌会员",
        value: 2,
      }, {
        label: "银牌会员",
        value: 3,
      }, {
        label: "金牌会员",
        value: 4,
      }, {
        label: "钻石会员",
        value: 5,
      }],
      title: "新增会员",
      isAdd: true, //判断是否为新增
    }
  },
  created() {
    this.getMember(0, 10, "", "");
  },
  methods: {
    getMember(index, size, nick, mobile) {
      var _this = this;
      var data = {
        Index: index,
        Size: size,
        Nick: nick,
        Mobile: mobile
      };
      data = JSON.stringify(data);
      fetch("/api/getUserList", {
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
    addMember() {
      this.openForm = true;
      this.isAdd = true;
      this.title = "新增会员";
    },
    searchMember(type, key) {
      // this.loading = true;
      if (type === "Nick") {
        this.getMember(0, 10, key, "");
      } else if (type === "Mobile") {
        this.getMember(0, 10, "", key);
      } else {
        this.getMember(0, 10, "", "");
      }
    },
    editMember(row) {
      this.openForm = true;
      this.isAdd = false;
      this.title = "编辑会员";
      this.ruleForm = row;
    },
    Submit() {
      if (this.isAdd) {
        this.submitAdd();
      } else {
        this.submitEdit();
      }
    },
    //提交新增的会员
    submitAdd() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/addUser", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          _this.$notify({
            message: '新增成功',
            type: 'success'
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
    //提交编辑的会员
    submitEdit() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/editUser", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          _this.$notify({
            message: '编辑成功',
            type: 'success'
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
    delMember(row) {
      var _this = this;
      this.$confirm('确认要删除吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        var data = {
          Id: row.Id
        };
        data = JSON.stringify(data);
        fetch("/api/delMember", {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': "application/json"
          },
          body: data
        }).then(res => res.json()).then(result => {
          if (result.Code === 200) {
            _this.$notify({
              message: '删除成功',
              type: 'success'
            });
            _this.getMember(0, 10, "");
          } else {
            _this.$message.error('服务器错误，请稍后再试');
            console.log(result)
          }
        }).catch(error => {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(error)
        })
      }).catch(() => {

      });
    },
    Close() {
      this.openForm = false;
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = this.addItem; //将ruleForm初始化
      this.getMember(0, 10, "", "");
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getMember(this.currentPage - 1, val, "", "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getMember(val - 1, this.pageSize, "", "");
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
