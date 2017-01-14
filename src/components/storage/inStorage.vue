<template>
  <section>
    <search :haveAdd="have" :searchList="list" :searchSource="source" :addSource="source" :defaultValue="searchType" v-on:addstorage="addStorage" v-on:searchstorage="searchStorage"></search>
  </section>
</template>
<script>
import search from "../common/search.vue";
export default {
  data() {
      return {
        list: [{
          label: "书名",
          value: "bookname"
        }, {
          label: "类别",
          value: "category"
        }, {
          label: "出版社",
          value: "publish"
        }],
        have: true,
        source: "instorage", //搜索种类
        searchType: "书名", //默认的搜索类型
      }
    },
    methods: {
      addStorage() {
        console.log(123);
      },
      searchStorage() {

      },
    },
    components: {
      search,
    }
}
</script>
<style type="text/css">
</style>
