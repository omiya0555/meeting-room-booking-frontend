<template>
  <AppHome></AppHome>
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
  methods: {
    logout() {
      // 誤操作によるログアウトを防止する確認フォーム
      if(confirm("ログアウトしますか？")){
        // ログアウト処理
        localStorage.removeItem('token'); // トークンを削除
        
        this.$router.push('/'); // ログインページ
      }
    }
  },
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
