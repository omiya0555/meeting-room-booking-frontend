<template>
  <router-view/>
</template>

<script>
import AppHome from './components/AppHome.vue';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token') // ログインしているかどうかの状態を確認
    };
  },
  components: AppHome,
  watch: {
    // 認証状態が変わったときに再評価
    // 値が更新されないままルーターに評価されることを防ぐ
    $route() {
      this.isAuthenticated = !!localStorage.getItem('token');
    }
  },
}
</script>

<style>
</style>
