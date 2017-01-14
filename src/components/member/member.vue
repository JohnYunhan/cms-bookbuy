<template>
  <section>
    <search :haveAdd="have" :searchList="list" :searchSource="source" :addSource="source" :defaultValue="searchType" v-on:addmember="addMember" v-on:searchmember="searchMember"></search>
  </section>
</template>
<script>
import search from "../common/search.vue";
export default {
  data() {
      return {
        list: [{
          label: "用户名",
          value: "username"
        }, {
          label: "账号",
          value: "userId"
        }, {
          label: "手机号",
          value: "cellphone"
        }], //搜索类型
        have: true,
        source: "member", //搜索种类
        searchType: "用户名", //默认的搜索类型
      }
    },
    methods: {
      addMember(addItem) {
        console.log(addItem);
      },
      searchMember(searchItem) {
        console.log(searchItem);
      },
    },
    components: {
      search,
    }
}
</script>
<style type="text/css">
</style>
