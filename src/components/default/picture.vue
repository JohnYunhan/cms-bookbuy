<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addPicture="addPicture" @searchPicture="searchPicture" @getPicture="getPicture"></search>
    </header>
    <section style="padding:0 20px 20px">
      <el-table :data="tableData" border align="center" style="width:100%">
        <el-table-column align="center" prop="Name" label="名称">
        </el-table-column>
        <el-table-column align="center" prop="Url" label="链接">
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
            <i class="fa fa-edit fa-lg" @click="editPicture(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4,5,6]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </footer>
    <el-dialog :title="title" size="tiny" top="25%" v-model="handleForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="Name" label="名称" :label-width="labelwidth">
          <el-input v-model="ruleForm.Name"></el-input>
        </el-form-item>
        <el-form-item prop="Url" label="链接" :label-width="labelwidth">
          <el-input v-model="ruleForm.Url"></el-input>
        </el-form-item>
        <el-form-item label="启用" :label-width="labelwidth">
          <el-switch on-text="是" v-bind:true-value="true" v-bind:false-value="false" off-text="否" v-model="ruleForm.Status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Close">取 消</el-button>
        <el-button type="primary" @click="Submit">提 交</el-button>
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
      source: "picture", //搜索种类
      searchType: "Name", //默认的搜索类型
      tableData: [],
      // loading: true,
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
      title: "编辑轮播图",
      labelwidth: "60px",
      handleForm: false,
      isEdit: true,
      addItem: {},
      ruleForm: {
        Name: "",
        Url: "",
        Status: true
      },
      rules: {
        Name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        Url: [{
          required: true,
          message: '请输入链接',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.getPicture(0, 10, "");
    this.addItem = this.ruleForm; //保存ruleForm的初始值
  },
  methods: {
    getPicture(index, size, name) {
      var _this = this;
      var data = {
        Index: index,
        Size: size,
        Name: name
      };
      data = JSON.stringify(data);
      fetch("/api/getPictureList", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: data
      }).then(res => res.json()).then(result => {
        if (result.Code === 200) {
          var item = result.Data;
          _this.pageSize = item.length;
          _this.totalCount = result.TotalCount;
          //判断是否为null
          if (!item) {
            _this.tableData = [];
          } else {
            //清空原来的数据，避免叠加
            _this.tableData = [];
            if (item instanceof Array) {
              //返回的结果是数组
              _this.tableData = item;
            } else {
              //返回的结果是对象
              _this.tableData.push(item);
            }
          }
          _this.shiftDate(_this.tableData);
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    searchPicture(type, key) {
      // this.loading = true;
      if (type === "Name") {
        this.getPicture(0, 10, key);
      }
    },
    addPicture() {
      this.handleForm = true;
      this.title = "新增轮播图";
      this.isEdit = false;
    },
    submitAdd() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/addPicture", {
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
          _this.Close();
          _this.getPicture(0, 10, "");
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    editPicture(row) {
      this.handleForm = true;
      this.title = "编辑轮播图";
      this.isEdit = true;
      this.ruleForm = row;
    },
    submitEdit() {
      var _this = this;
      var data = JSON.stringify(this.ruleForm);
      fetch("/api/editPicture", {
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
          _this.Close();
          _this.getPicture(0, 10, "");
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    Submit() {
      if (this.isEdit) {
        this.submitEdit();
      } else {
        this.submitAdd();
      }
    },
    Close() {
      this.handleForm = false;
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = this.addItem; //将ruleForm初始化
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getPicture(this.currentPage - 1, val, "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getPicture(val - 1, this.pageSize, "");
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
</style>
