<template>
  <el-row class="panel">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-col :span="6">
        <el-button type="primary" icon="plus" @click="addMember">新增</el-button>
      </el-col>
      <el-col :span="18">
        <select class="searchlist" v-model=searchList>
          <option v-for="item in list" value="item.value">{{item.label}}
          </option>
        </select>
        <el-input class="searchkey" v-model="searchKey"></el-input>
        <el-button type="primary" icon="search" @click="searchMember">查询</el-button>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
      return {
        searchList: "用户名",
        searchKey: "",
        list: [{
          label: "用户名",
          value: "username"
        }, {
          label: "账号",
          value: "userId"
        }, {
          label: "手机号",
          value: "cellphone"
        }]
      }
    },
    methods: {
      addMember() {

      },
      searchMember() {
        console.log(111)
        console.log(this.searchList);
      }
    }
}
</script>
<style scoped>
.toolbar {
  margin-top: 50px;
  padding: 10px;
  background-color: #fff;
}

.searchlist {
  width: 70px;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  border: 1px solid #c0ccda;
  border-radius: 4px;
  outline: medium;
}

.searchkey {
  width: 240px;
}
</style>
