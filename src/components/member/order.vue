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
