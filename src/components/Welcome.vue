<template>
	<section>
		<el-col :span="24" class="welcome"></el-col>
	</section>
</template>

<script>
	import NProgress from 'nprogress'

	export default {
    data() {
      return {

      }
    }
  }
</script>

<style scoped>
	.welcome {
		background-image: url(../assets/welcome.png);
	}
</style>