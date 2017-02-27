<template>
  <section>
    <header v-show="!openForm">
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addBook="addBook" @searchBook="searchBook" @getBook="getBook"></search>
    </header>
    <section v-if="!openForm" style="padding:0 20px 18px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form inline class="table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.Id }}</span>
              </el-form-item>
              <el-form-item label="名称">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="作者">
                <span>{{ props.row.Author }}</span>
              </el-form-item>
              <el-form-item label="类别">
                <span>{{ props.row.Category }}</span>
              </el-form-item>
              <el-form-item label="出版社">
                <span>{{ props.row.Press }}</span>
              </el-form-item>
              <el-form-item label="出版日期">
                <span>{{ props.row.PublishDate | subDate }}</span>
              </el-form-item>
              <el-form-item label="版次">
                <span>{{ props.row.Edition }}</span>
              </el-form-item>
              <el-form-item label="ISBN">
                <span>{{ props.row.ISBN }}</span>
              </el-form-item>
              <el-form-item label="字数">
                <span>{{ props.row.WordsCount }}</span>
              </el-form-item>
              <el-form-item label="简介">
                <span>{{ props.row.Abstract }}</span>
              </el-form-item>
              <el-form-item label="定价">
                <span>{{ props.row.ListPrice }}</span>
              </el-form-item>
              <el-form-item label="售价">
                <span>{{ props.row.SellPrice }}</span>
              </el-form-item>
              <el-form-item label="库存数量">
                <span>{{ props.row.Count }}</span>
              </el-form-item>
              <el-form-item label="点击次数">
                <span>{{ props.row.ClickCount }}</span>
              </el-form-item>
              <el-form-item label="推荐">
                <template scope="scope">
                  <span style="color:#13ce66" v-if="props.row.IsRecommend">是</span>
                  <span style="color:red" v-else>否</span>
                </template>
              </el-form-item>
              <el-form-item label="下架">
                <template scope="scope">
                  <span v-if="props.row.IsSoldOut">是</span>
                  <span v-else>否</span>
                </template>
              </el-form-item>
              <el-form-item label="上架日期">
                <span>{{ props.row.CreateDate | shiftDate }}</span>
              </el-form-item>
              <el-form-item label="更新日期">
                <span>{{ props.row.UpdateDate | shiftDate }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="Name">
        </el-table-column>
        <el-table-column align="center" label="作者" prop="Author">
        </el-table-column>
        <el-table-column align="center" label="类别" prop="Category">
        </el-table-column>
        <el-table-column align="center" label="出版社" prop="Press">
        </el-table-column>
        <el-table-column align="center" label="库存数量" prop="Count">
        </el-table-column>
        <el-table-column align="center" label="点击次数" prop="ClickCount">
        </el-table-column>
        <el-table-column align="center" label="推荐">
          <template scope="scope">
            <span style="color:#13ce66" v-if="scope.row.IsRecommend">是</span>
            <span style="color:red" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下架">
          <template scope="scope">
            <span v-if="scope.row.IsSoldOut">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <i class="el-icon-edit" @click="editBook(scope.row)" style="cursor:pointer;font-size:18px"></i>
            <i class="el-icon-delete2" @click="delBook(scope.row)" style="cursor:pointer;font-size:18px"></i>
          </template>
        </el-table-column>
      </el-table>
      <section style="padding:0;margin-top:18px;margin-left:-16px">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </section>
    </section>
    <section v-else>
      <el-row type="flex" justify="center">
        <el-col :span="9">
          <h5 style="text-align: center;margin: 10px 0"><b>{{title}}</b></h5>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="">
            <el-form-item label="名称" prop="Name" style="width: 318px;">
              <el-input v-model="ruleForm.Name"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="Author" style="width: 318px;">
              <el-input v-model="ruleForm.Author"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="Category">
              <el-select v-model="ruleForm.Category" placeholder="请选择类别">
                <el-option label="计算机" value="计算机"></el-option>
                <el-option label="教材" value="教材"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出版社" prop="Press">
              <el-select v-model="ruleForm.Press" placeholder="请选择出版社">
                <el-option label="机械工业出版社" value="机械工业出版社"></el-option>
                <el-option label="人民邮电出版社" value="人民邮电出版社"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出版日期" prop="PublishDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.PublishDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="版次" prop="Edition">
              <el-input-number v-model="ruleForm.Edition" :min="1" :max="20"></el-input-number>
            </el-form-item>
            <el-form-item label="ISBN" prop="ISBN" style="width: 318px;">
              <el-input v-model="ruleForm.ISBN"></el-input>
            </el-form-item>
            <el-form-item label="字数" prop="WordsCount">
              <el-input-number v-model="ruleForm.WordsCount" :min="1" :max="9999999999"></el-input-number>
            </el-form-item>
            <el-form-item label="简介" prop="Abstract" style="width: 318px;">
              <el-input type="textarea" autosize v-model="ruleForm.Abstract"></el-input>
            </el-form-item>
            <el-form-item label="定价" prop="ListPrice" style="width: 280px;">
              <el-input v-model="ruleForm.ListPrice"></el-input>
            </el-form-item>
            <el-form-item label="售价" prop="SellPrice" style="width: 280px;">
              <el-input v-model="ruleForm.SellPrice"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="Count">
              <el-input-number v-model="ruleForm.Count" :min="1" :max="999"></el-input-number>
            </el-form-item>
            <el-form-item label="推荐" prop="IsRecommend">
              <el-switch on-text="是" v-bind:true-value="true" v-bind:false-value="false" off-text="否" v-model="ruleForm.IsRecommend"></el-switch>
            </el-form-item>
            <el-form-item v-if="isEdit" label="下架" prop="IsSoldOut">
              <el-switch v-bind:true-value="true" v-bind:false-value="false" on-text="是" off-text="否" v-model="ruleForm.IsSoldOut"></el-switch>
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
          label: "书名",
          value: "Name"
        }, {
          label: "作者",
          value: "Author"
        }, {
          label: "类别",
          value: "Category"
        }, {
          label: "出版社",
          value: "Press"
        }], //搜索类型
        have: true, //是否有添加功能
        source: "book", //搜索种类
        searchType: "Name", //默认的搜索类型
        tableData: [],
        // loading: true,
        totalCount: 0, //数据总量
        currentPage: 1, //当前页码
        pageSize: 1, //每页的数据量
        openForm: false, //打开添加或编辑图书的表单
        addItem: {},
        ruleForm: {
          Name: "",
          Author: "",
          Category: "",
          Press: "",
          PublishDate: "",
          Edition: 1,
          ISBN: "",
          WordsCount: 1,
          Abstract: "",
          ListPrice: "",
          SellPrice: "",
          Count: 1,
          IsRecommend: false,
          Image: ["http://img3x0.ddimg.cn/86/1/23648810-1_w_1.jpg", "http://img3x0.ddimg.cn/86/1/23648810-1_x_1.jpg", "http://img3x0.ddimg.cn/86/1/23648810-1_u_1.jpg"],
          IsSoldOut: false,
        },
        rules: {
          Name: [{
            required: true,
            message: '请输入图书名称',
            trigger: 'blur'
          }],
          Author: [{
            required: true,
            message: '请输入作者',
            trigger: 'blur'
          }],
          Category: [{
            required: true,
            message: '请选择类别',
            trigger: 'change'
          }],
          Press: [{
            required: true,
            message: '请选择出版社',
            trigger: 'change'
          }],
          PublishDate: [{
            type: 'date',
            required: true,
            message: '请选择出版日期',
            trigger: 'change'
          }],
          ISBN: [{
            required: true,
            message: '请输入ISBN',
            trigger: 'blur'
          }],
          Abstract: [{
            required: true,
            message: '请输入简介',
            trigger: 'blur'
          }],
          ListPrice: [{
            required: true,
            message: '请输入定价',
            trigger: 'blur'
          }],
          SellPrice: [{
            required: true,
            message: '请输入售价',
            trigger: 'blur'
          }],
        },
        title: "新增图书",
        isEdit: true, //判断是否为编辑
      }
    },
    created() {
      this.getBook(0, 10, "", "", "", "");
      this.addItem = this.ruleForm; //保存ruleForm的初始值
    },
    methods: {
      getBook(index, size, name, author, category, press) {
        var _this = this;
        var data = {
          Index: index,
          Size: size,
          Name: name,
          Author: author,
          Category: category,
          Press: press
        };
        data = JSON.stringify(data);
        fetch("/api/getBookList", {
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
      searchBook(type, key) {
        if (type === "Name") {
          this.getBook(0, 10, key, "", "", "");
        } else if (type === "Author") {
          this.getBook(0, 10, "", key, "", "");
        } else if (type === "Category") {
          this.getBook(0, 10, "", "", key, "");
        } else if (type === "Press") {
          this.getBook(0, 10, "", "", "", key);
        } else {
          this.getBook(0, 10, "", "", "", "");
        }
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getBook(this.currentPage - 1, val, "", "", "", "");
      },
      currentChange(val) {
        this.currentPage = val;
        this.getBook(val - 1, this.pageSize, "", "", "", "");
      },
      editBook(row) {
        this.openForm = true;
        this.title = "编辑图书";
        this.isEdit = true;
        // row = JSON.parse(JSON.stringify(row));
        this.ruleForm = row;
      },
      addBook() {
        this.openForm = true;
        this.isEdit = false;
        this.title = "新增图书";
      },
      Submit() {
        if (this.isEdit) {
          this.submitEdit();
        } else {
          this.submitAdd();
        }
      },
      //提交新增的图书
      submitAdd() {
        var _this = this;
        var data = JSON.stringify(this.ruleForm);
        fetch("/api/addBook", {
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
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //提交编辑的图书
      submitEdit() {
        var _this = this;
        var data = JSON.stringify(this.ruleForm);
        fetch("/api/setBook", {
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
          } else {
            console.log(result)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      delBook(row) {
        var _this = this;
        this.$confirm('确认要删除吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          var data = {
            Id: row.Id
          };
          data = JSON.stringify(data);
          fetch("/api/delBook", {
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
              _this.getBook(0, 10, "");
            } else {
              console.log(result)
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {

        });
      },
      Close() {
        this.openForm = false;
        this.$refs["ruleForm"].resetFields();
        this.ruleForm = this.addItem; //将ruleForm初始化
        this.getBook(0, 10, "", "", "", "");
      },
    },
    filters: {
      //截取日期
      subDate: function(date) {
        return date.substring(0, 10);
      },
      //日期转换
      shiftDate: function(date) {
        date = new Date(date);
        return date.toLocaleDateString();
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
</style>
