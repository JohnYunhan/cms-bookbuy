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
        <el-table-column align="center" prop="CreateDate" label="创建日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template scope="scope">
            <span v-if="scope.row.Status">已启用</span>
            <span v-else>已禁用</span>
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
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </footer>
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
    }
  },
  created() {
    this.getPicture(0, 10, "");
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
          // _this.loading = false;
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addPicture() {
      var _this = this;
      var data = {
        Name: "开学促销",
        Url: "http://image31.bookschina.com/pro-images/170222school/1000300.jpg?id=2"
      }
      data = JSON.stringify(data);
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
    editPicture(row) {
      console.log(row)
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getPicture(this.currentPage - 1, val, "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getPicture(val - 1, this.pageSize, "");
    }
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
  margin-bottom: 10px;
}
</style>
