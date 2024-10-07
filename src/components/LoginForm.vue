<template>
    <div class="loginForm">
        
        <form @submit.prevent="login" class="flex items-center justify-center h-screen">
            <div class="w-48 border p-4">
                <input class="w-36 border rounded-sm p-1 m-2 hover:border-gray-400 transition" type="email" v-model="email" placeholder="EMAIL" required />
                <input class="w-36 border rounded-sm p-1 m-2 hover:border-gray-400 transition" type="password" v-model="password" placeholder="PASSWORD" required /> 
                <div class="flex justify-center">
                    <button class="border rounded-sm p-1 m-2 hover:border-gray-600 transition" type="submit"><span class="text-sm text-gray-600">LOG IN</span></button>
                </div>
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LoginForm',
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('/login', {
                    email: this.email,
                    password: this.password,
                });
                // ログイン成功時の処理
                localStorage.setItem('token', response.data.token); // トークン保存
                this.$router.push('/home'); // ホームにリダイレクト
            } catch (error) {
                this.errorMessage = 'ログインに失敗しました。'; // エラーメッセージを表示
                alert('ログインに失敗しました。もう一度試してください。');
            }
        },
    },
};
</script>

<style>
</style>