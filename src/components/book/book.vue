<template>
  <section>
    <search :haveAdd="have" :searchList="list" :searchSource="source" :addSource="source" :defaultValue="searchType" v-on:addbook="addBook" v-on:searchbook="searchBook"></search>
  </section>
</template>
<script>
import search from "../../common/search.vue";
export default {
  data() {
      return {
        list: [{
          label: "书名",
          value: "bookname"
        }, {
          label: "作者",
          value: "author"
        }, {
          label: "类别",
          value: "category"
        }, {
          label: "出版社",
          value: "publish"
        }], //搜索类型
        have: true,
        source: "book", //搜索种类
        searchType: "书名", //默认的搜索类型
      }
    },
    methods: {
      addBook(addItem) {
        console.log(addItem);
      },
      searchBook(searchItem
) {
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
