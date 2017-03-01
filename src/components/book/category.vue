<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addCategory="addCategory" @searchCategory="searchCategory" @getCategory="getCategory"></search>
    </header>
    <section style="padding:0 20px 18px">
      <el-table :data="tableData" border align="center" style="width:100%">
        <el-table-column align="center" prop="Name" label="名称">
        </el-table-column>
        <el-table-column align="center" prop="UpdateDate" label="更新日期">
        </el-table-column>
        <el-table-column align="center" prop="CreateDate" label="创建日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template scope="scope">
            <span style="color:#13ce66" v-if="scope.row.Status">已启用</span>
            <span style="color:red" v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="el-icon-edit" @click="editCategory(scope.row)" style="cursor:pointer;font-size:18px"></i>
            <i class="el-icon-delete2" @click="delCategory(scope.row)" style="cursor:pointer;font-size:18px"></i>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </footer>
    <el-dialog :title="title" size="tiny" top="20%" @close="Close" v-model="handleForm">
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item prop="Name" label="名称" :label-width="labelwidth">
          <el-input v-model="ruleForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="启用" :label-width="labelwidth">
          <el-switch on-text="是" v-bind:true-value="true" v-bind:false-value="false" off-text="否" v-model="ruleForm.Status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Close">取 消</el-button>
        <el-button type="primary" @click="submitEdit">提 交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import search from "../common/search.vue";
export default {
  props: [],
  data() {
    return {
      list: [{
        label: "名称",
        value: "Name"
      }], //搜索类型
      have: true,
      // multiply: false,//是否有多种搜索类型
      source: "category", //搜索种类
      searchType: "Name", //默认的搜索类型
      tableData: [],
      formValid: true,
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
      title: "编辑类别",
      labelwidth: "60px",
      handleForm: false,
      ruleForm: {
        Name: "",
        Status: true
      },
      // rules: {
      //   Name: [{
      //     required: true,
      //     message: '请输入名称',
      //     trigger: 'blur'
      //   }]
      // },
    }
  },
  created() {
    this.getCategory(0, 10, "");
  },
  methods: {
    getCategory(index, size, name) {
      var _this = this;
      var data = {
        Index: index,
        Size: size,
        Name: name
      };
      data = JSON.stringify(data);
      fetch("/api/getCategoryList", {
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
    searchCategory(type, key) {
      if (type === "Name") {
        this.getCategory(0, 10, key);
      }
    },
    addCategory() {
      this.$prompt('请输入类别', '新增类别', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4E00-\u9FA5\uF900-\uFA2D]/,
        inputErrorMessage: "请输入类别",
        customClass: "prompts"
      }).then((value) => {
        this.submitAdd(value.value);
      }).catch(() => {

      });
    },
    submitAdd(name) {
      var _this = this;
      var data = {
        Name: name
      }
      data = JSON.stringify(data);
      fetch("/api/addCategory", {
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
            type: 'success',
            duration: 3000
          });
          _this.getCategory(0, 10, "");
        } else {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(result)
        }
      }).catch(error => {
        _this.$message.error('服务器错误，请稍后再试');
        console.log(error.Message)
      })
    },
    editCategory(row) {
      this.handleForm = true;
      this.ruleForm = row;
    },
    checkForm() {
      if (this.ruleForm.Name == "") {
        this.$message({
          message: '请输入名称',
          type: 'warning'
        });
        this.formValid = false;
      }
    },
    submitEdit() {
      var _this = this;
      this.checkForm();
      if (this.formValid) {
        var data = JSON.stringify(this.ruleForm);
        fetch("/api/editCategory", {
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
      }
    },
    delCategory(row) {
      var _this = this;
      this.$confirm('确认要删除吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        var data = {
          Id: row.Id
        };
        data = JSON.stringify(data);
        fetch("/api/delCategory", {
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
              type: 'success',
              duration: 3000
            });
            _this.getCategory(0, 10, "");
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
      this.handleForm = false;
      this.$refs["ruleForm"].resetFields();
      this.getCategory(0, 10, "");
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getCategory(this.currentPage - 1, val, "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getCategory(val - 1, this.pageSize, "");
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
    // totalCount: function(val) {
    //   this.totalCount = val;
    // },
    // pageSize: function(val) {
    //   this.pageSize = val;
    // },
  },
  components: {
    search,
  }
}
</script>
<style scoped>
footer {
  margin-left: 5px;
  margin-bottom: 18px;
}

.prompts {
  top: 20%;
  width: 300px;
}
</style>
