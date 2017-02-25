<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addMember="addMember" @searchMember="searchMember" @getMember="getMember"></search>
    </header>
    <section style="padding:0 20px 20px">
      <el-table :data="tableData" border style="width:100%">
        <el-table-column align="center" prop="Nick" label="昵称">
        </el-table-column>
        <el-table-column align="center" prop="Name" label="姓名">
        </el-table-column>
        <el-table-column align="center" prop="Mobile" label="手机">
        </el-table-column>
        <el-table-column align="center" prop="Email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="Level" label="等级">
        </el-table-column>
        <el-table-column align="center" prop="CreateDate" label="注册日期">
        </el-table-column>
        <el-table-column align="center" prop="UpdateDate" label="更新日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template scope="scope">
            <span v-if="scope.row.Valid">已启用</span>
            <span v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <!-- <el-button type="text" @click="editMember(scope.row)" size="small">编辑</el-button> -->
            <i class="fa fa-edit fa-lg" @click="editMember(scope.row)"></i>
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
      // loading: true,
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
          // _this.loading = false;
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
      // this.loading = true;
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
