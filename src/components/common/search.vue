<template>
  <el-row type="flex" justify="space-between" class="toolbar">
    <!--工具条-->
    <el-col :span="4">
      <el-button v-if="haveAdd" type="primary" icon="plus" @click="add">新增</el-button>
    </el-col>
    <el-col :span="16" class="center">
      <el-select class="searchtype" v-model="searchType">
        <el-option v-for="item in searchList" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input class="searchkey" v-model="searchKey" @keyup.enter="search"></el-input>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
      <!-- <el-input class="searchkey" placeholder="" v-model="searchKey">
        <el-select v-model="searchType" slot="prepend">
          <el-option v-for="item in searchList" :label="item.label" :value="item.value">
        </el-select>
        <el-button slot="append" icon="search" @click="search"></el-button>
      </el-input> -->
    </el-col>
    <el-col :span="3" class="right">
      <el-button type="success" class="fa fa-refresh" @click="refresh"></el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: ["haveAdd", "searchList", "source", "defaultValue"],
  data() {
    return {
      searchType: this.defaultValue,
      searchKey: "",
      addItem: "add",
      searchItem: "search",
    }
  },
  methods: {
    add() {
      switch (this.source) {
        case "member":
          {
            this.$emit("addmember", this.addItem);
          }
          break;
        case "book":
          {
            this.$emit("addBook", true);
          }
          break;
        case "picture":
          {
            this.$emit("addPicture", );
          }
          break;
      }
    },
    search() {
      switch (this.source) {
        case "member":
          {
            this.$emit("searchMember", this.searchType, this.searchKey);
          }
          break;
        case "book":
          {
            this.$emit("searchBook", this.searchType, this.searchKey);
          }
          break;
        case "order":
          {
            this.$emit("searchOrder", this.searchType, this.searchKey);
          }
          break;
        case "picture":
          {
            this.$emit("searchPicture", this.searchType, this.searchKey);
          }
          break;
      }
    },
    refresh() {
      switch (this.source) {
        case "member":
          {
            this.$emit("getMember", 0, 10, "", "");
          }
          break;
        case "book":
          {
            this.$emit("getBook", 0, 10, "", "", "", "");
          }
          break;
        case "order":
          {
            this.$emit("getOrder", 0, 10, "", "", "");
          }
          break;
        case "picture":
          {
            this.$emit("getPicture", 0, 10, "");
          }
          break;
      }
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
  padding: 20px;
  background-color: #fff;
  /*margin-bottom: 10px;*/
}

.searchkey {
  width: 260px;
}

.searchtype {
  width: 88px;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}
</style>
