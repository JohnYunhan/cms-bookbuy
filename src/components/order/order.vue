<template>
  <section>
    <header v-show="!openForm">
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @searchOrder="searchOrder" @getOrder="getOrder"></search>
    </header>
    <section v-if="!openForm" style="padding:0 20px 18px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form inline class="table-expand">
              <el-form-item label="订单号">
                <span>{{ props.row.Id }}</span>
              </el-form-item>
              <el-form-item label="昵称">
                <span>{{ props.row.Nick }}</span>
              </el-form-item>
              <el-form-item label="图书名称">
                <span v-for="(name,index) in props.row.BuyInfor">{{ name.BookName }}({{ name.count }}本)<span v-if="index!==props.row.BuyInfor.length-1">、</span></span>
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
              <el-form-item label="配送时间">
                <span>{{ props.row.DeliveryTime }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.Note }}</span>
              </el-form-item>
              <el-form-item label="下单日期">
                <span>{{ props.row.CreateDate}}</span>
              </el-form-item>
              <el-form-item label="修改日期">
                <span>{{ props.row.UpdateDate }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <template>
                  <span v-if="props.row.Status==0">已失效</span>
                  <span v-else-if="props.row.Status==-1">已删除</span>
                  <span v-else-if="props.row.Status==1">待确认</span>
                  <span v-else-if="props.row.Status==2">配送中</span>
                  <span v-else-if="props.row.Status==3">已签收</span>
                  <span v-else-if="props.row.Status==4">审核中</span>
                  <span v-else-if="props.row.Status==5">已退款</span>
                  <span v-else-if="props.row.Status==6">已评价</span>
                  <span v-else-if="props.row.Status==7">退换中</span>
                  <span v-else-if="props.row.Status==6">已换货</span>
                  <span v-else>待评价</span>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="订单号" prop="Id">
        </el-table-column>
        <el-table-column align="center" label="昵称" prop="Nick">
        </el-table-column>
        <el-table-column align="center" width="300" label="图书">
          <template scope="scope">
            <span v-for="(name,index) in scope.row.BuyInfor">{{ name.BookName }}({{ name.count }}本)<span v-if="index!==scope.row.BuyInfor.length-1">、</span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" label="运费" prop="Freight">
        </el-table-column>
        <el-table-column align="center" width="80" label="总额" prop="Total">
        </el-table-column>
        <el-table-column align="center" width="115" label="下单日期" prop="CreateDate">
        </el-table-column>
        <el-table-column align="center" width="115" label="修改日期" prop="UpdateDate">
        </el-table-column>
        <el-table-column align="center" width="125" label="订单状态">
          <template scope="scope">
            <el-select @change="updStatus(scope.row.Id,$event)" v-model="scope.row.Status">
              <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="fa fa-edit fa-lg icon" @click="editOrder(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column> -->
      </el-table>
      <section style="padding:0;margin-top:18px;margin-left:-16px">
        <el-pagination @size-change="add" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </section>
    </section>
    <section v-else>
      <el-row type="flex" justify="center">
        <el-col :span="9">
          <h5 style="text-align: center;margin: 10px 0"><b>修改订单</b></h5>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="">
            <el-form-item label="图书" prop="BookName">
              <el-input v-model="ruleForm.BookName"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="Count">
              <el-input-number v-model="ruleForm.Count" :min="1" :max="999"></el-input-number>
            </el-form-item>
            <el-form-item label="运费" prop="Freight">
              <el-input type="number" v-model="ruleForm.Freight"></el-input>
            </el-form-item>
            <el-form-item label="总额" prop="Total">
              <el-input type="number" v-model="ruleForm.Total"></el-input>
            </el-form-item>
            <el-form-item label="收货人" prop="Name">
              <el-input v-model="ruleForm.Name"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="Mobile">
              <el-input v-model="ruleForm.Mobile"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="Address">
              <el-input type="textarea" autosize v-model="ruleForm.Address"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="Status">
              <el-select v-model="ruleForm.Status">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Submit">保存</el-button>
              <el-button @click="Close">取消</el-button>
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
  data() {
      return {
        list: [{
          label: "订单号",
          value: "OrderId"
        }, {
          label: "昵称",
          value: "Nick"
        }],
        have: false, //是否有添加功能
        source: "order", //搜索种类
        searchType: "OrderId", //默认的搜索类型
        totalCount: 0, //数据总量
        currentPage: 1, //当前页码
        pageSize: 1, //每页的数据量
        Status: "", //订单状态
        tableData: [],
        usrInfor: {}, //会员信息
        bookInfor: {}, //图书信息
        openForm: false, //打开编辑订单的表单
        ruleForm: {
          Id: "",
          BookId: "",
          BookName: "",
          Count: 1,
          Freight: 0,
          Total: 0,
          Name: "",
          Mobile: "",
          Address: "",
          Status: 1,
        },
        rules: {
          BookName: [{
            required: true,
            message: '请输入图书名称',
            trigger: 'blur'
          }],
          Name: [{
            required: true,
            message: '请输入收货人姓名',
            trigger: 'blur'
          }],
          // Total: [{
          //   required: true,
          //   message: '请输入订单总额',
          //   trigger: 'blur'
          // }],
          Mobile: [{
            required: true,
            message: '请输入收货人电话',
            trigger: 'blur'
          }],
          Address: [{
            required: true,
            message: '请输入收货人地址',
            trigger: 'blur'
          }],
        },
        options: [{
          label: "已删除",
          value: -1,
        }, {
          label: "已失效",
          value: 0,
        }, {
          label: "待确认",
          value: 1,
        }, {
          label: "配送中",
          value: 2,
        }, {
          label: "已签收",
          value: 3,
        }, {
          label: "审核中",
          value: 4,
        }, {
          label: "已退款",
          value: 5,
        }, {
          label: "已评价",
          value: 6,
        }, {
          label: "退换中",
          value: 7,
        }, {
          label: "已换货",
          value: 8,
        }, {
          label: "待评价",
          value: 9,
        }],
      }
    },
    created() {
      this.getOrder(0, 10, "", "", "");
    },
    methods: {
      getOrder(index, size, orderid, nick, status) {
        var _this = this;
        var data = {
          Index: index,
          Size: size,
          Id: orderid,
          Nick: nick,
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
            _this.tableData = result.Data;
            for (var i = 0; i < _this.tableData.length; i++) {
              _this.tableData[i].BuyInfor = JSON.parse(_this.tableData[i].BuyInfor);
            }
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
            _this.bookInfor = result.Data;
          } else {
            _this.$message.error('服务器错误，请稍后再试');
            console.log(result)
          }
        }).catch(error => {
          _this.$message.error('服务器错误，请稍后再试');
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
        this.openForm = true;
        row = JSON.parse(JSON.stringify(row));
        this.ruleForm = row;
      },
      updStatus(id, status) {
        var _this = this;
        var data = {
          "Id": id,
          "Status": status,
        };
        data = JSON.stringify(data);
        fetch("/api/setOrderStatus", {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': "application/json"
          },
          body: data
        }).then(res => res.json()).then(result => {
          if (result.Code === 200) {
            _this.$notify({
              message: '修改成功',
              type: 'success'
            });
          } else {
            _this.$message.error('状态修改失败，请稍后再试');
            console.log(result)
          }
        }).catch(error => {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(error)
        })
      },
      Submit() {
        var _this = this;
        var data = JSON.stringify(this.ruleForm);
        fetch("/api/setOrder", {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': "application/json"
          },
          body: data
        }).then(res => res.json()).then(result => {
          if (result.Code === 200) {
            _this.getOrder(0, 10, "", "", data.Status);
            _this.Close();
            _this.$message({
              message: '修改成功',
              type: 'success',
              duration: 3000
            });
          } else {
            _this.$message.error('服务器错误，请稍后再试');
            console.log(result)
          }
        }).catch(error => {
          _this.$message.error('服务器错误，请稍后再试');
          console.log(error)
        })
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
          Total: 75.9,
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
              type: 'success',
              duration: 3000
            });
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      Close() {
        this.openForm = false;
        this.$refs["ruleForm"].resetFields();
      },
      currentChange(val) {
        this.currentPage = val;
        this.getOrder(val - 1, this.pageSize, "", "", "");
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
    filters: {

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
<style scoped>
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

.el-pagination {
  margin-top: 10px;
}

.icon:hover {
  color: #20a0ff;
}
</style>
