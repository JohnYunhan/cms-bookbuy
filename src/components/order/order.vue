<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @searchOrder="searchOrder" @getOrder="getOrder"></search>
    </header>
    <section style="padding:0 20px 20px">
      <el-table :data="tableData" border align="center" style="width:100%">
        <el-table-column prop="Id" label="订单Id">
        </el-table-column>
        <!-- <el-table-column prop="BookId" label="图书Id">
        </el-table-column>
        <el-table-column prop="UserId" label="会员Id">
        </el-table-column> -->
        <el-table-column prop="Count" label="数量">
        </el-table-column>
        <el-table-column prop="Total" label="总额">
        </el-table-column>
        <el-table-column prop="CreateDate" label="下单日期">
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <span v-if="scope.row.Status==0">已失效</span>
            <span v-else-if="scope.row.Status==1">待确认</span>
            <span v-else-if="scope.row.Status==2">未发货</span>
            <span v-else-if="scope.row.Status==3">配送中</span>
            <span v-else-if="scope.row.Status==4">已签收</span>
            <span v-else-if="scope.row.Status==5">审核中</span>
            <span v-else>已退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template scope="scope">
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <i class="el-icon-edit" Medium @click="editOrder(scope.row)"></i> <i Medium class="el-icon-search" @click="lookOrderDetail(scope.row)"></i>
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
  data() {
      return {
        list: [{
          label: "订单号",
          value: "OrderId"
        }, {
          label: "账号",
          value: "UserId"
        }],
        have: false, //是否有添加功能
        source: "order", //搜索种类
        searchType: "UserId", //默认的搜索类型
        totalCount: 0, //数据总量
        currentPage: 1, //当前页码
        pageSize: 1, //每页的数据量
        Status: "", //订单状态
        tableData: [],
        orderDetail: {}, //订单详情
        usrInfor: {}, //会员信息
        bookInfor: {}, //图书信息
      }
    },
    created() {
      this.getOrder(0, 10, "", "", "");
    },
    methods: {
      getOrder(index, size, orderid, usrid, status) {
        var _this = this;
        var data = {
          Index: index,
          Size: size,
          OrderId: orderid,
          UserId: usrid,
          Status: status
        };
        data = JSON.stringify(data);
        fetch("/api/getOrderList", {
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
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //根据UserId获取会员信息
      getUserById(usrid) {
        var _this = this;
        fetch("/api/getUserById?Id=" + usrid, {
          method: "GET",
          credentials: "include"
        }).then(result => {
          if (result.Code === 200) {
            var item = result;
            //判断是否为null
            if (!item) {
              _this.usrInfor = [];
            } else {
              //清空原来的数据，避免叠加
              _this.usrInfor = [];
              if (item instanceof Array) {
                //返回的结果是数组
                _this.usrInfor = item;
              } else {
                //返回的结果是对象
                _this.usrInfor.push(item);
              }
            }
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //根据BookId获取图书信息
      getBookById(bookid) {
        var _this = this;
        fetch("/api/getBookById?Id=" + bookid, {
          method: "GET",
          credentials: "include"
        }).then(result => {
          if (result.Code === 200) {
            var item = result;
            //判断是否为null
            if (!item) {
              _this.bookInfor = [];
            } else {
              //清空原来的数据，避免叠加
              _this.bookInfor = [];
              if (item instanceof Array) {
                //返回的结果是数组
                _this.bookInfor = item;
              } else {
                //返回的结果是对象
                _this.bookInfor.push(item);
              }
            }
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //查看订单详情
      lookOrderDetail(row) {
        var orderid = row.Id;
        var usrid = row.UserId;
        var bookid = row.BookId;
        this.getUserById(usrid);
        this.getBookById(bookid);
        this.orderDetail = {
          UserName: this.usrInfor.Nick,
          BookName: row.BookName,
          Count: row.Count,
          Total: row.Total,
          Name: row.Name,
          Mobile: row.Mobile,
          Address: row.Address
        }
      },
      searchOrder(type, key) {
        if (type === "UserId") {
          this.getOrder(0, 10, "", key, this.Status);
        } else {
          this.getOrder(0, 10, key, "", this.Status);
        }
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getOrder(this.currentPage - 1, val, "", "");
        var _this = this;
        var data = {
          OrderId: "20170220213216",
          BookId: ["book2ds5a29oizforobk", "book2ds5a53sizg6jaux"],
          BookName: ["Node.js权威指南", "JavaScript DOM编程艺术"]
          UserId: "user2ds5a7fciz9rryos",
          Count: [2, 1],
          Total: "179.3",
          Name: "刘云汉",
          Mobile: "13361642438",
          Address: "紫阳大道99号"
        }
        data = JSON.stringify(data);
        fetch("/api/addOrder", {
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
      currentChange(val) {
        this.currentPage = val;
        this.getOrder(val - 1, this.pageSize, "", "", "");
      },
    },
    watch: {
      usrInfor: function(val) {
        this.usrInfor = val;
      },
      bookInfor: function(val) {
        this.bookInfor = val;
      },
    },
    components: {
      search,
    }
}
</script>
<style type="text/css">
</style>
