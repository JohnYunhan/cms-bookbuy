<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addModule="addModule" @searchModule="searchModule" @getModule="getModule"></search>
    </header>
    <section style="padding:0 20px 20px">
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
            <i class="fa fa-edit fa-lg" @click="editModule(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </footer>
    <el-dialog :title="title" size="tiny" top="25%" v-model="handleForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
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
      source: "module", //搜索种类
      searchType: "Name", //默认的搜索类型
      tableData: [],
      // loading: true,
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
      title: "编辑模块",
      labelwidth: "60px",
      handleForm: false,
      ruleForm: {
        Name: "",
        Status: true
      },
      rules: {
        Name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.getModule(0, 10, "");
  },
  methods: {
    getModule(index, size, name) {
      var _this = this;
      var data = {
        Index: index,
        Size: size,
        Name: name
      };
      data = JSON.stringify(data);
      fetch("/api/getModuleList", {
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
    searchModule(type, key) {
      if (type === "Name") {
        this.getModule(0, 10, key);
      }
    },
    addModule() {
      this.$prompt('请输入模块', '新增模块', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4E00-\u9FA5\uF900-\uFA2D]/,
        inputErrorMessage: "请输入模块"
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
      fetch("/api/addModule", {
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
            type: 'success'
          });
          _this.getModule(0, 10, "");
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    editModule(row) {
      this.handleForm = true;
      this.ruleForm = row;
    },
    submitEdit() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/editModule", {
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
            type: 'success'
          });
          _this.getModule(0, 10, "");
          _this.Close();
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    Close() {
      this.handleForm = false;
      this.$refs["ruleForm"].resetFields();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getModule(this.currentPage - 1, val, "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getModule(val - 1, this.pageSize, "");
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
  watch: {},
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
