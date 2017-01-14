<template>
  <section>
    <search :haveAdd="have" :searchList="list" :searchSource="source" :defaultValue="searchType" v-on:searchorder="searchOrder"></search>
  </section>
</template>
<script>
import search from "../common/search.vue";
export default {
  data() {
      return {
        list: [{
          label: "订单号",
          value: "orderId"
        }, {
          label: "书名",
          value: "bookname"
        }, {
          label: "用户名",
          value: "username"
        }, {
          label: "账号",
          value: "userId"
        }, {
          label: "手机号",
          value: "cellphone"
        }],
        have: false,
        source: "order",
        searchType: "用户名",
      }
    },
    methods: {
      searchOrder(searchItem) {
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
