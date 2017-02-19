<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addMember="addMember" @searchMember="searchMember" @getMember="getMember"></search>
    </header>
    <section style="padding:0 20px 20px">
      <el-table :data="tableData" v-loading.table="loading" border align="center" style="width:100%">
        <el-table-column prop="Nick" label="昵称">
        </el-table-column>
        <el-table-column prop="Mobile" label="手机">
        </el-table-column>
        <el-table-column prop="Name" label="姓名">
        </el-table-column>
        <el-table-column prop="Email" label="邮箱">
        </el-table-column>
        <el-table-column prop="Level" label="等级">
        </el-table-column>
        <el-table-column prop="CreateDate" label="注册日期">
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <span v-if="scope.row.Valid">已启用</span>
            <span v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template scope="scope">
            <el-button type="text" @click="editMember(scope.$index, scope.row)" size="small">编辑</el-button>
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
      loading: true,
      totalCount: 0, //数据总量
      currentPage: 1, //当前页码
      pageSize: 1, //每页的数据量
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
          var item = result.Data;
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
          _this.loading = false;
        } else {
          console.log(result)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addMember(addItem) {
      console.log(addItem);
    },
    searchMember(type, key) {
      this.loading = true;
      if (type === "Nick") {
        this.getMember(0, 10, key, "");
      } else if (type === "Mobile") {
        this.getMember(0, 10, "", key);
      } else {
        this.getMember(0, 10, "", "");
      }
    },
    editMember(index, row) {
      console.log(index, row)
    },
    sizeChange(val) {
      this.pageSize = val;
      console.log(val)
      this.getMember(this.currentPage - 1, val, "", "");
    },
    currentChange(val) {
      this.currentPage = val;
      this.getMember(val - 1, this.pageSize, "", "");
    }
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
</style>
