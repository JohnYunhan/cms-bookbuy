<template>
  <el-row type="flex" justify="space-between" class="toolbar">
    <!--工具条-->
    <el-col :span="1">
      <el-button v-if="haveAdd" type="primary" icon="plus" @click="add">新增</el-button>
    </el-col>
    <el-col :span="9">
      <el-select class="searchtype" v-model="searchType" placeholder="请选择">
        <el-option v-for="item in searchList" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input class="searchkey" v-model="searchKey" @keyup.enter="search"></el-input>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="success" class="fa fa-refresh" @click="refresh"></el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: ["haveAdd", "searchList", "addSource", "searchSource", "defaultValue"],
  data() {
    return {
      searchType: this.defaultValue,
      searchKey: "",
      addItem: "add",
      searchItem: "search"
    }
  },
  methods: {
    add() {
      switch (this.addSource) {
        case "member":
          {
            this.$emit("addmember", this.addItem);
          }
          break;
        case "book":
          {
            this.$emit("addbook", this.addItem);
          }
          break;
      }
    },
    search() {
      switch (this.searchSource) {
        case "member":
          {
            this.$emit("searchmember", this.searchItem);
          }
          break;
        case "book":
          {
            this.$emit("searchbook", this.searchItem);
          }
          break;
        case "order":
          {
            this.$emit("searchorder", this.searchItem);
          }
          break;
      }
    },
    refresh() {
      location.reload();
    },
  }
}
</script>
<style scoped>
@media screen and (min-device-width: 1000px) {
  html {
    font-size: 14px;
  }
}

.toolbar {
  padding: 10px;
  background-color: #fff;
}

.searchtype {
  width: 88px;
}

.searchkey {
  width: 40px;
}
</style>
