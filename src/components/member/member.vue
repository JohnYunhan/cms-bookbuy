<template>
  <el-row type="flex" justify="space-between" class="toolbar">
    <!--工具条-->
    <el-col :span="1">
      <el-button type="primary" icon="plus" @click="addMember">新增</el-button>
    </el-col>
    <el-col :span="9">
      <el-select class="searchlist" v-model="searchList" placeholder="请选择">
        <el-option v-for="item in list" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input class="searchkey" v-model="searchKey"></el-input>
      <el-button type="primary" icon="search" @click="searchMember">查询</el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="success" class="fa fa-refresh" @click="refresh"></el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
      return {
        searchList: "",
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
        // console.log(this.searchList);
      },
      refresh() {
        location.reload();
      },
    }
}
</script>
<style scoped>
.toolbar {
  padding: 10px;
  background-color: #fff;
}

.searchlist {
  width: 90px;
}

.searchkey {
  width: 240px;
}
</style>
