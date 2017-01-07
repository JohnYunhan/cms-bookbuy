<template>
  <section>
    <search v-bind:list="list"></search>
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
        }]
      }
    },
    methods: {
      add() {
        console.log(123);
      },
      search() {

      },
    },
    components: {
      search,
    }
}
</script>
<style type="text/css">
</style>
