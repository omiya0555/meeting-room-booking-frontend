<template>
    <div class="inset-x-0 bottom-0 bg-gray-900 h-24 py-8">
        <span class="flex justify-center text-white">This is a simple meeting room booking app developed vue, fullcalendar, Laravel API.</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isAuthenticated: !!localStorage.getItem('token') // ログインしているかどうかの状態を確認
        };
    },
    methods: {
        logout() {
            // 誤操作によるログアウトを防止する確認フォーム
            if (confirm("ログアウトしますか？")) {
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