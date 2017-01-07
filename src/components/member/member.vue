<template>
  <section>
    <search :list="list" :searchSource="source" :addSource="source" :defaultValue="searchType"></search>
  </section>
</template>
<script>
import search from "../../common/search.vue";
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
        }],
        source: "member",
        searchType: "用户名",
      }
    },
    methods: {
      addMember() {

      },
      searchMember() {

      },
    },
    components: {
      search,
    }
}
</script>
<style type="text/css">
</style>
