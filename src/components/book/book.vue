<template>
  <section>
    <header v-show="!openForm">
      <search :haveAdd="have" :searchList="list" :source="source" :defaultValue="searchType" @addBook="addBook" @searchBook="searchBook" @getBook="getBook"></search>
    </header>
    <section v-if="!openForm" style="padding:0 20px 20px">
      <el-table :data="tableData" border align="center" style="width:100%">
        <el-table-column prop="Id" label="ID">
        </el-table-column>
        <el-table-column prop="Name" label="书名">
        </el-table-column>
        <el-table-column prop="Author" label="作者">
        </el-table-column>
        <el-table-column prop="Category" label="类别">
        </el-table-column>
        <el-table-column prop="Press" label="出版社">
        </el-table-column>
        <!--  <el-table-column prop="PublishDate" label="出版日期">
        </el-table-column>
        <el-table-column prop="Edition" label="版次">
        </el-table-column>
        <el-table-column prop="ISBN" label="ISBN">
        </el-table-column>
        <el-table-column prop="WordsCount" label="字数">
        </el-table-column>
        <el-table-column prop="Abstract" label="简介">
        </el-table-column> -->
        <!-- <el-table-column prop="Image" label="图片">
        </el-table-column>
        <el-table-column prop="ListPrice" label="定价">
        </el-table-column>
        <el-table-column prop="SellPrice" label="售价">
        </el-table-column> -->
        <el-table-column prop="Count" label="库存数量">
        </el-table-column>
        <el-table-column prop="ClickCount" label="点击次数">
        </el-table-column>
        <el-table-column label="推荐">
          <template scope="scope">
            <span v-if="scope.row.IsRecommend===1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="下架">
          <template scope="scope">
            <span v-if="scope.row.IsSoldOut===1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="CreateDate" label="上架日期">
        </el-table-column>
        <el-table-column prop="UpdateDate" label="更新日期">
        </el-table-column> -->
        <el-table-column prop="" label="操作">
          <template scope="scope">
            <el-button type="text" @click="editMember(scope.$index, scope.row)" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <section>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </section>
    </section>
    <section v-else>
      <el-row type="flex" justify="center">
        <el-col :span="9">
          <h5 style="text-align: center;margin: 10px 0"><b>新增图书</b></h5>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="">
            <el-form-item label="图书名称" prop="Name" style="width: 318px;">
              <el-input v-model="ruleForm.Name"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="Author" style="width: 318px;">
              <el-input v-model="ruleForm.Author"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="Category">
              <el-select v-model="ruleForm.Category" placeholder="请选择类别">
                <el-option label="计算机" value="category2ds5a29oizforoc6"></el-option>
                <el-option label="教材" value=""></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出版社" prop="Press">
              <el-select v-model="ruleForm.Press" placeholder="请选择出版社">
                <el-option label="机械工业出版社" value="press2ds5a6foizfo47eu"></el-option>
                <el-option label="清华大学出版社" value=""></el-option>
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
              <el-input type="textarea" v-model="ruleForm.Abstract"></el-input>
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
            <el-form-item label="是否推荐" prop="IsRecommend">
              <el-switch on-text="" off-text="" v-model="ruleForm.IsRecommend"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Save">保存</el-button>
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
        searchType: "书名", //默认的搜索类型
        tableData: [],
        // loading: true,
        totalCount: 0, //数据总量
        currentPage: 1, //当前页码
        pageSize: 1, //每页的数据量
        openForm: false, //打开添加或编辑图书的表单
        ruleForm: {
          Name: "",
          Author: "",
          Category: "",
          Press: "",
          PublishDate: "",
          Edition: "",
          ISBN: "",
          WordsCount: 1,
          Abstract: "",
          ListPrice: "",
          SellPrice: "",
          Count: 1,
          IsRecommend: false,
          Image: ["http://img3x6.ddimg.cn/82/5/23460706-1_w_1.jpg", "http://img3x6.ddimg.cn/82/5/23460706-1_x_1.jpg", "http://img3x6.ddimg.cn/82/5/23460706-1_u_1.jpg"]
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
          Edition: [{
            required: true,
            message: '请输入版次',
            trigger: 'blur'
          }],
          ISBN: [{
            required: true,
            message: '请输入ISBN',
            trigger: 'blur'
          }],
          WordsCount: [{
            required: true,
            message: '请输入字数',
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
          Count: [{
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getBook(0, 10, "", "", "", "");
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
      searchBook(searchItem) {
        console.log(searchItem);
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getBook(this.currentPage - 1, val, "", "");
      },
      currentChange(val) {
        this.currentPage = val;
        this.getBook(val - 1, this.pageSize, "", "", "", "");
      },
      addBook(isOpen) {
        if (isOpen) {
          this.openForm = true;

        }
      },
      //保存添加的图书
      Save() {
        var _this = this;
        if (this.ruleForm.IsRecommend) {
          this.ruleForm.IsRecommend = 1;
        } else {
          this.ruleForm.IsRecommend = 0;
        }
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
            _this.Close();
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
      Close() {
        // this.openForm = false;
        // this.$refs[ruleForm].resetFields();
        var _this = this;
        var data = {
          Name: "教材"
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
    },
    components: {
      search,
    }
}
</script>
<style scoped>
</style>
