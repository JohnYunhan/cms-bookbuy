<template>
  <section>
    <header>
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @searchOrder="searchOrder" @getOrder="getOrder"></search>
    </header>
    <section style="padding:0 20px 20px">
      <!-- <el-table :data="tableData" border style="width:100%">
        <el-table-column align="center" prop="Id" label="订单号">
        </el-table-column>
        <el-table-column align="center" prop="Nick" label="昵称">
        </el-table-column>
        <el-table-column align="center" prop="BookName" label="图书">
        </el-table-column>
        <el-table-column align="center" prop="Count" label="数量">
        </el-table-column>
        <el-table-column align="center" prop="Total" label="总额">
        </el-table-column>
        <el-table-column align="center" prop="CreateDate" label="下单日期">
        </el-table-column>
        <el-table-column align="center" label="状态">
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
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="fa fa-edit fa-lg" @click="editOrder(scope.row)"></i>
            <i class="fa fa-search fa-lg" @click="lookOrderDetail(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="right" inline class="table-expand">
              <el-form-item label="订单号">
                <span>{{ props.row.Id }}</span>
              </el-form-item>
              <el-form-item label="昵称">
                <span>{{ props.row.Nick }}</span>
              </el-form-item>
              <el-form-item label="图书名称">
                <span>{{ props.row.BookName }}</span>
              </el-form-item>
              <el-form-item label="数量">
                <span>{{ props.row.Count }}</span>
              </el-form-item>
              <el-form-item label="运费">
                <span>{{ props.row.Freight }}</span>
              </el-form-item>
              <el-form-item label="总额">
                <span>{{ props.row.Total }}</span>
              </el-form-item>
              <el-form-item label="收货人">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="收货人手机">
                <span>{{ props.row.Mobile }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.Address }}</span>
              </el-form-item>
              <el-form-item label="下单日期">
                <span>{{ props.row.CreateDate }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{ props.row.Status }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="Id">
        </el-table-column>
        <el-table-column label="图书名称" prop="BookName">
        </el-table-column>
        <el-table-column label="昵称" prop="Nick">
        </el-table-column>
        <el-table-column label="数量" prop="Count">
        </el-table-column>
        <el-table-column label="总额" prop="Total">
        </el-table-column>
        <el-table-column label="下单日期" prop="CreateDate">
        </el-table-column>
        <el-table-column label="订单状态">
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
      </el-table>
    </section>
    <footer>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </footer>
    <el-dialog title="订单详情" size="large" v-model="openOrderDetail">
      <el-table :data="orderDetail">
        <el-table-column property="Id" label="订单号"></el-table-column>
        <el-table-column property="Nick" label="昵称"></el-table-column>
        <el-table-column property="BookName" label="图书"></el-table-column>
        <el-table-column property="Count" label="数量"></el-table-column>
        <el-table-column property="Total" label="总额"></el-table-column>
        <el-table-column property="Name" label="收货人"></el-table-column>
        <el-table-column property="Mobile" label="收货人手机"></el-table-column>
        <el-table-column property="Address" label="收货地址"></el-table-column>
        <el-table-column property="Status" label="订单状态"></el-table-column>
      </el-table>
    </el-dialog>
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
          value: "Nick"
        }],
        have: false, //是否有添加功能
        source: "order", //搜索种类
        searchType: "Nick", //默认的搜索类型
        totalCount: 0, //数据总量
        currentPage: 1, //当前页码
        pageSize: 1, //每页的数据量
        Status: "", //订单状态
        tableData: [],
        orderDetail: [], //订单详情
        openOrderDetail: false, //查看订单详情窗口
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
        this.orderDetail = []; //防止叠加
        this.orderDetail.push(row);
        this.openOrderDetail = true;
      },
      searchOrder(type, key) {
        if (type === "UserId") {
          this.getOrder(0, 10, "", key, this.Status);
        } else {
          this.getOrder(0, 10, key, "", this.Status);
        }
      },
      editOrder(row) {
        console.log(row)
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getOrder(this.currentPage - 1, val, "", "");
      },
      add() {
        var _this = this;
        var data = {
          Id: "20170220213216",
          BookId: "book1sh5kqf7gaizjld9he",
          BookName: "Node.js开发指南",
          UserId: "user1sh5kqf3o7iz9o71p9",
          Count: 2,
          Freight: 0.5,
          Total: "75.4",
          Name: "刘云汉",
          Mobile: "13361642438",
          Address: "紫阳大道99号",
          Nick: "John"
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
.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 90px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
